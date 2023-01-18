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
allSongs = list(filter(lambda x: x["lyric"] is not None, sum(songsByYear, [])))

# 全曲の歌詞から名詞を取り出して分かち書きする
for song in allSongs:
    node = mecab.parseToNode(song["lyric"])
    norns = []
    while node:
        kind = node.feature.split(",")[0]
        if kind == "名詞":
            norns.append(node.surface)
        node = node.next
    song["wakati"] = " ".join(norns)

# 分かち書きされた文章の類似度をTF-IDFで解析
vectorizer = TfidfVectorizer()
tf = vectorizer.fit_transform([x["wakati"] for x in allSongs])
transformer = TfidfTransformer()
tfidf = transformer.fit_transform(tf)
tfidf_array = tfidf.toarray()
cs = cosine_similarity(tfidf_array)
with open("./data/tfidf/tfidf.csv", "w") as fp:
    w = csv.writer(fp, lineterminator="\n")
    w.writerow([x["title"] for x in allSongs])
    w.writerows(cs)
