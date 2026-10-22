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
