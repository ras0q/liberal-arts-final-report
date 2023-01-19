import fs from 'fs'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

const datadir = './data/songs'
const yearAndSelector = {
  1990: '#mw-content-text > div.mw-parser-output > ul:nth-child(18) > li',
  1991: '#mw-content-text > div.mw-parser-output > ul:nth-child(25) > li',
  1992: '#mw-content-text > div.mw-parser-output > ul:nth-child(23) > li',
  2000: '#mw-content-text > div.mw-parser-output > ul:nth-child(39) > li',
  2001: '#mw-content-text > div.mw-parser-output > ul:nth-child(41) > li',
  2002: '#mw-content-text > div.mw-parser-output > ul:nth-child(45) > li',
}

for (const [year, selector] of Object.entries(yearAndSelector)) {
  console.log("Start fetching", year)

  const res = await fetch(`https://ja.wikipedia.org/wiki/${year}年の音楽`)
  const html = await res.text()
  const dom = new JSDOM(html)
  const document = dom.window.document

  const songTexts = document.querySelectorAll(selector)

  const songs = Array.from(songTexts).map((st) => {
    // 例:
    // 1位 B.B.クィーンズ：『おどるポンポコリン』
    const matches = st.textContent.match(/\d+位 (.+)：[『「](.+)[』」]/)
    return { artist: matches[1], title: matches[2].replace(/[/／].+$/g, '') }
  })

  fs.writeFileSync(`${datadir}/${year}.json`, JSON.stringify(songs, null, 2))

  console.log("Finished fetching", year)
}
