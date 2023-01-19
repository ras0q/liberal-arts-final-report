# 1999.jsonから歌詞を取り出して、形態素解析して、TF-IDFを計算する

import csv
import json
import os

import MeCab as mc
from sklearn.feature_extraction.text import TfidfTransformer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

mecab = mc.Tagger("-Owakati")

datadir = "./data/songs"
files = sorted(os.listdir(datadir))
songsByYear = [json.load(open(f"{datadir}/{f}")) for f in files]

# 全曲の歌詞から名詞を取り出して分かち書きする
# 年代ごとの曲を全て結合する
yearLyrics = []
for songs in songsByYear:
    songs = list(filter(lambda x: x["lyric"] is not None, songs))
    for song in songs:
        node = mecab.parseToNode(song["lyric"])
        norns = []
        while node:
            kind = node.feature.split(",")[0]
            if kind == "名詞":
                norns.append(node.surface)
            node = node.next
        song["wakati"] = " ".join(norns)
        print(song["wakati"])
    yearLyrics.append(" ".join([s["wakati"] for s in songs]))

# 分かち書きされた文章の類似度をTF-IDFで解析
vectorizer = TfidfVectorizer()
tf = vectorizer.fit_transform(yearLyrics)
transformer = TfidfTransformer()
tfidf = transformer.fit_transform(tf)
tfidf_array = tfidf.toarray()
cs = cosine_similarity(tfidf_array)
with open("./data/tfidf/tfidf-year.csv", "w") as fp:
    w = csv.writer(fp, lineterminator="\n")
    w.writerow([f.replace(".json", "") for f in files])
    w.writerows(cs)
