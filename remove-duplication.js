import fs from 'fs'

const allTitles = []

const datadir = './data/songs'
const yearSongs = fs.readdirSync(datadir)
for (const yearSong of yearSongs) {
  /** @type {Array<{artist: string, title: string, lyric: string | null}>} */
  const songs = JSON.parse(
    fs.readFileSync(`${datadir}/${yearSong}`, 'utf-8')
  ).filter((song) => song.lyric !== null)

  const uniqueSongs = []
  for (const song of songs) {
    if (allTitles.indexOf(song.title) === -1) {
      allTitles.push(song.title)
      uniqueSongs.push(song)
    } else {
      console.log('dup: ', song.title)
    }
  }

  fs.writeFileSync(
    `${datadir}/${yearSong}`,
    JSON.stringify(uniqueSongs, null, 2)
  )

  console.log(`Finished ${yearSong}, ${uniqueSongs.length} songs`)
}
