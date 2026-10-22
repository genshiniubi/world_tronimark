# 朋友圈连通块 · 题解

## 思路

并查集初始有 n 个集合。每次读入一条好友边，查找两个端点所在集合；如果不同就合并，并把连通块数量减一。路径压缩让后续查询接近常数。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> parent_;

int find_root(int x) {
    if (parent_[x] == x) return x;
    return parent_[x] = find_root(parent_[x]);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    parent_.resize(n + 1);
    iota(parent_.begin(), parent_.end(), 0);
    int components = n;
    while (m--) {
        int u, v;
        cin >> u >> v;
        int a = find_root(u), b = find_root(v);
        if (a != b) {
            parent_[a] = b;
            --components;
        }
    }
    cout << components << '\n';
    return 0;
}
```

## 常见错误

- 合并后没有减少计数。
- 把 1-based 节点写成 0-based。
- find 没有路径压缩，极端数据可能变慢。
