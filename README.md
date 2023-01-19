# liberal-arts-final-report

B3 4Q 教養卒論の調査スクリプト

```sh
./init.sh
```

## Usage

1. ランキングの取得
   - `fetch-billboard.js`
     - ~2007年以降はBillboardからランキングを取得する
   - `fetch-wikipedia-oricon.js`
     - 2006年以前はWikipediaからオリコンチャートを取得する

2. 歌詞の取得
    - `fetch-lyrics.js`
      - 1で取得したjsonに歌詞情報を付加する
      - nullになる場合がある

3. 余分データの削除
    - `filter-songs.js`
      - 歌詞が`null`のものを削除する
      - 上から40件のみを残す
