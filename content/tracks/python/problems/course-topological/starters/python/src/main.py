import heapq
from collections import defaultdict

n, m = map(int, input().split())
graph = defaultdict(list)
indegree = [0] * (n + 1)
# TODO: 建图与统计入度
order = []
print(-1 if len(order) < n else " ".join(map(str, order)))
