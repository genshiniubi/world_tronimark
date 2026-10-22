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
