# 岛屿数量 · 题解

## 思路

扫描网格，遇到未访问的陆地就把答案加一，并用 BFS/DFS 把整座岛屿的 1 全部标记为已访问。每个格子最多处理一次，复杂度 O(nm)。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<string> grid(n);
    for (auto& row : grid) cin >> row;
    int count = 0;
    int dx[4] = {-1, 1, 0, 0};
    int dy[4] = {0, 0, -1, 1};
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            if (grid[i][j] != '1') continue;
            ++count;
            queue<pair<int,int>> q;
            q.push({i, j});
            grid[i][j] = '0';
            while (!q.empty()) {
                auto point = q.front();
                q.pop();
                int x = point.first, y = point.second;
                for (int d = 0; d < 4; ++d) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
                    if (grid[nx][ny] != '1') continue;
                    grid[nx][ny] = '0';
                    q.push({nx, ny});
                }
            }
        }
    }
    cout << count << '\n';
    return 0;
}
```

## Python 3 参考代码

```python
from collections import deque

n, m = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]
count = 0
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
for i in range(n):
    for j in range(m):
        if grid[i][j] != "1":
            continue
        count += 1
        queue = deque([(i, j)])
        grid[i][j] = "0"
        while queue:
            x, y = queue.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == "1":
                    grid[nx][ny] = "0"
                    queue.append((nx, ny))
print(count)
```

## 常见错误

- 只检查右/下方向，导致漏掉部分连通块。
- 入队后没有标记，重复访问。
