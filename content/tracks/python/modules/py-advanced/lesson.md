# 滑动窗口与拓扑排序

## 你会学到
- 用左右指针维护“最多 K 个不同字符”的窗口
- 用字典记录窗口内字符次数
- 用入度表和队列做拓扑排序
- 如何判断有向图是否存在环

## 滑动窗口
窗口题的模板是“右进左出”：

```python
left = 0
counts = {}
best = 0
for right, ch in enumerate(s):
    counts[ch] = counts.get(ch, 0) + 1
    while len(counts) > k:
        left_ch = s[left]
        counts[left_ch] -= 1
        if counts[left_ch] == 0:
            del counts[left_ch]
        left += 1
    best = max(best, right - left + 1)
```

## 拓扑排序
拓扑排序处理“先做 A 才能做 B”的依赖。每次取入度为 0 的节点，删除它的出边，再把新的入度 0 节点入队。

```python
from collections import deque
queue = deque(i for i in range(1, n + 1) if indegree[i] == 0)
while queue:
    node = queue.popleft()
    order.append(node)
    for nxt in graph[node]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            queue.append(nxt)
```

## 常见坑
- 窗口收缩时没有删除计数为 0 的键。
- 拓扑排序结束后仍有节点未输出，说明有环。
- 队列换成优先队列可以输出字典序最小的拓扑序。

## 练习建议
先手推一个窗口和一个依赖图，再写代码验证。
