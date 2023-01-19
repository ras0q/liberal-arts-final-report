#!/bin/sh

# billboardとwikipediaをスクレイピングして上位曲を取得しdata/songs/{year}.jsonに保存する
echo "fetching billboard and wikipedia..."
node ./fetch-wikipedia-oricon.js
# node ./fetch-billboard.js # FIXME: wrong signature type
echo "done."

# 歌詞を取得しdata/songs/{year}.jsonを更新する
echo "fetching lyrics..."
node ./fetch-lyrics.js
echo "done."

# フィルタリングする
echo "filtering songs..."
node ./filter-songs.js
echo "done."

# tf-idfで歌詞の類似度を計算し、data/tfidf以下に結果を保存する
echo "calculating tf-idf..."
python3 ./tfidf.py
python3 ./tfidf-year.py
echo "done."
