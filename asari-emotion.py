import json
import os

import matplotlib.pyplot as plt
from asari.api import Sonar


def average(data):
    return sum(data) / len(data)


datadir = "./data/songs"
files = sorted(os.listdir(datadir))
songsByYear = [json.load(open(f"{datadir}/{f}")) for f in files]

sonar = Sonar()
positiveAves = [
    # classes[0] is negative, classes[1] is positive
    average([sonar.ping(text=s["lyric"])["classes"][1]["confidence"] for s in songs])
    for songs in songsByYear
]
print(positiveAves)

x = [f.split(".")[0] for f in files]

# positiveAvesを3つずつplotする
for i in range(0, len(positiveAves), 3):
    plt.plot(x[i : i + 3], positiveAves[i : i + 3], marker="o")

for i, v in enumerate(positiveAves):
    plt.text(i, v, f"{v:.3f}", ha="center", va="top")

plt.savefig("./data/emotion/positive.png")
