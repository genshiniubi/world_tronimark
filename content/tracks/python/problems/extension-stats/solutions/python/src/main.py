import sys
from pathlib import Path

n = int(sys.stdin.readline())
names = sys.stdin.read().split()

counts = {}
for name in names:
    ext = Path(name).suffix or "none"
    counts[ext] = counts.get(ext, 0) + 1
for ext, count in sorted(counts.items()):
    print(ext, count)
