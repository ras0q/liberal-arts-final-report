import { Semaphore } from 'await-semaphore'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

const semaphore = new Semaphore(10)

const datadir = './data/songs'
const yearSongs = fs.readdirSync(datadir)
for (const yearSong of yearSongs) {
  /** @type {Array<{artist: string, title: string, lyric: string | null}>} */
  const songs = JSON.parse(fs.readFileSync(`${datadir}/${yearSong}`, 'utf-8'))

  const withLyrics = await Promise.all(
    songs.map(async (song) => {
      if (song.lyric) {
        return song
      }

      const release = await semaphore.acquire()

      const title =
        song.title === 'W / X / Y'
          ? song.title
          : song.title.replace(/[〜～]/g, ' ').replace(/[/／].+$/g, '')
      const html = await (
        await fetch(`https://www.uta-net.com/search/?Keyword=${title}&sort=4`)
      ).text()
      const dom = new JSDOM(html)
      const artistElements = dom.window.document.querySelectorAll(
        'table > tbody > tr > td > a > span.utaidashi'
      )
      const songPath =
        Array.from(artistElements).find((e) => e.textContent === song.artist)
          ?.parentElement.href ??
        artistElements[0]?.parentElement.href ??
        null

      if (!songPath) {
        release()
        console.log(`FAIL: ${song.title} by ${song.artist}`)
        return { ...song, lyric: null }
      }

      const songHtml = await (
        await fetch(`https://www.uta-net.com/${songPath}`)
      ).text()
      const songDom = new JSDOM(songHtml)
      const songDocument = songDom.window.document
      const lyric = songDocument.querySelector('#kashi_area').textContent

      console.log(`PASS: ${song.title} by ${song.artist}`)

      release()
      return { ...song, lyric }
    })
  )

  fs.writeFileSync(`${datadir}/${yearSong}`, JSON.stringify(withLyrics, null, 2))

  console.log(`Finished ${yearSong}`)
}
