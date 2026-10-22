# 迷宫最短步数 · 题解

## 思路

把每个格子看成无权图节点，上下左右是边。BFS 按层扩展，第一次到达 E 的步数就是最短步数。入队时立即标记，避免重复。

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
    pair<int,int> start;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < m; ++j)
            if (grid[i][j] == 'S') start = {i, j};
    int dx[4] = {-1, 1, 0, 0};
    int dy[4] = {0, 0, -1, 1};
    queue<tuple<int,int,int>> q;
    q.push({start.first, start.second, 0});
    grid[start.first][start.second] = '#';
    while (!q.empty()) {
        auto state = q.front();
        q.pop();
        int x = get<0>(state), y = get<1>(state), dist = get<2>(state);
        if (grid[x][y] == 'E') {
            cout << dist << '\n';
            return 0;
        }
        for (int d = 0; d < 4; ++d) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
            if (grid[nx][ny] == '#') continue;
            char cell = grid[nx][ny];
            grid[nx][ny] = '#';
            q.push({nx, ny, dist + 1});
            if (cell == 'E') {
                cout << dist + 1 << '\n';
                return 0;
            }
        }
    }
    cout << -1 << '\n';
    return 0;
}
```

## Python 3 参考代码

```python
from collections import deque

n, m = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]
start = None
for i in range(n):
    for j in range(m):
        if grid[i][j] == "S":
            start = (i, j)
queue = deque([(start[0], start[1], 0)])
grid[start[0]][start[1]] = "#"
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
while queue:
    x, y, dist = queue.popleft()
    if grid[x][y] == "E":
        print(dist)
        break
    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if not (0 <= nx < n and 0 <= ny < m):
            continue
        if grid[nx][ny] == "#":
            continue
        cell = grid[nx][ny]
        grid[nx][ny] = "#"
        if cell == "E":
            print(dist + 1)
            raise SystemExit
        queue.append((nx, ny, dist + 1))
else:
    print(-1)
```

## 常见错误

- BFS 没有按层记录步数。
- 终点被覆盖成墙后才判断，导致找不到。
- 队列为空仍未输出 -1。
