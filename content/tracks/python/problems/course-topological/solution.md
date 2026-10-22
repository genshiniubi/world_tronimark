# 课程安排 · 题解

## 思路

用邻接表保存 a→b，统计每个节点的入度。把所有入度为 0 的节点放入最小堆，每次取出字典序最小的节点，删除它的出边；如果最终没有输出全部节点，说明图中有环。

## Python 3 参考代码

```python
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
```

## 常见错误

- 使用普通队列，无法保证字典序最小。
- 忘记检查环。
- 边方向建反。
