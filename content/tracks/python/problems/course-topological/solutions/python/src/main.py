import heapq
from collections import defaultdict

n, m = map(int, input().split())
graph = defaultdict(list)
indegree = [0] * (n + 1)
for _ in range(m):
    a, b = map(int, input().split())
    graph[a].append(b)
    indegree[b] += 1

queue = [i for i in range(1, n + 1) if indegree[i] == 0]
heapq.heapify(queue)
order = []
while queue:
    node = heapq.heappop(queue)
    order.append(node)
    for nxt in graph[node]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            heapq.heappush(queue, nxt)

print(-1 if len(order) < n else " ".join(map(str, order)))
