import fs from 'fs'

const limit = 40
const allUniqueSongs = []

const datadir = './data/songs'
const yearSongs = fs.readdirSync(datadir)
for (const yearSong of yearSongs) {
  /** @type {Array<{artist: string, title: string, lyric: string | null}>} */
  const songs = JSON.parse(
    fs.readFileSync(`${datadir}/${yearSong}`, 'utf-8')
  ).filter((song) => song.lyric !== null)

  const uniqueSongs = []
  for (let i = 0; i < songs.length; i++) {
    if (uniqueSongs.length >= limit) {
      break
    }

    const song = songs[i]
    if (
      allUniqueSongs.find(
        (s) =>
          s.title.toLowerCase() === song.title.toLowerCase() ||
          s.lyric === song.lyric
      ) === undefined
    ) {
      uniqueSongs.push(song)
      allUniqueSongs.push(song)
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
