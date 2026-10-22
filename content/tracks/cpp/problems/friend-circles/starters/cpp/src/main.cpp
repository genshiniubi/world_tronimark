#include <bits/stdc++.h>
using namespace std;

vector<int> parent_;

int find_root(int x) {
    // TODO: 路径压缩
    return x;
}

int main() {
    int n, m;
    cin >> n >> m;
    parent_.resize(n + 1);
    iota(parent_.begin(), parent_.end(), 0);
    int components = n;
    // TODO: 合并好友关系
    cout << components << '\n';
    return 0;
}
