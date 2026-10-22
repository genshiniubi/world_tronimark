#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<long long> greed(n), cookies(m);
    for (auto& x : greed) cin >> x;
    for (auto& x : cookies) cin >> x;
    sort(greed.begin(), greed.end());
    sort(cookies.begin(), cookies.end());
    int i = 0, j = 0;
    // TODO: 双指针分配
    cout << i << '\n';
    return 0;
}
