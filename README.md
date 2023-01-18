# liberal-arts-final-report

B3 4Q 教養卒論の調査スクリプト

## Usage

1. ランキングの取得
   - `fetch-billboard.js`
     - ~2007年以降はBillboardからランキングを取得する
   - `fetch-wikipedia-oricon.js`
     - 2006年以前はWikipediaからオリコンチャートを取得する

2. 歌詞の取得
    - `collect-lyrics.js`
      - 1で取得したjsonに歌詞情報を付加する
      - nullになる場合がある

3. nullデータの補完
    - 手動で行う
      - 曲名の「/」以下を削除
