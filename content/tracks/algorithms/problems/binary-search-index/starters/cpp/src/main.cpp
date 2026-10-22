#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (long long& x : a) cin >> x;
    while (q--) {
        long long target;
        cin >> target;
        int left = 0, right = n - 1, answer = -1;
        // TODO: 二分查找最左下标
        cout << answer << '\n';
    }
    return 0;
}
