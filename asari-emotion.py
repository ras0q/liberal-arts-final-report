import json
import os

import matplotlib.pyplot as plt
import pandas as pd
from asari.api import Sonar


def average(data):
    return sum(data) / len(data)


datadir = "./data/songs"
files = sorted(os.listdir(datadir))
songsByYear = [json.load(open(f"{datadir}/{f}")) for f in files]

sonar = Sonar()
positives = [
    # classes[0] is negative, classes[1] is positive
    [sonar.ping(text=s["lyric"])["classes"][1]["confidence"] for s in songs]
    for songs in songsByYear
]
print(positives)

x = [f.split(".")[0] for f in files]

df = pd.DataFrame(positives, index=x).transpose()
df.to_csv("./data/emotion/positive.csv")
df.plot.box(showmeans=True, grid=True, whis=[0, 100])
plt.savefig("./data/emotion/positive.png")
