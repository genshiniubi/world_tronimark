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
