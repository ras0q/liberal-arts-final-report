import csv

# tfidf.csvから値が0.5以上のセルの行と列を抽出
# 1行目は曲名が入っているので別で記録する
with open("./data/tfidf/tfidf.csv", "r") as f:
    reader = csv.reader(f)
    header = next(reader)
    for i, row in enumerate(reader):
        for j, cell in enumerate(row):
            if i >= j:
                continue
            if float(cell) >= 0.5:
                print(header[i], ",", header[j], ",", cell)
