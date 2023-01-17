import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

const res = await fetch(
  'https://billboard-japan.com/charts/detail?a=hot100_year&year=2022'
)
const html = await res.text()
const dom = new JSDOM(html)
const document = dom.window.document

// スクレイピング対策されていてnodejsから取得できないので以下の行をdevtoolで実行して結果を得る
const trs = document.querySelectorAll(
  '#content2 > div > div.leftBox > table > tbody > tr > td.name_td > div.name_detail'
)

const songs = Array.from(trs).map((tr) => {
  const title = tr
    .querySelector('p.musuc_title')
    .textContent.replace(/(^\n\s+|\s+$)/g, '')
  const artist = tr.querySelector('p.artist_name').textContent
  return { title, artist }
})

console.log(JSON.stringify(songs, null, 2))
