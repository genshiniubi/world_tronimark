#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (long long& x : a) cin >> x;
    while (q--) {
        long long target;
        cin >> target;
        int left = 0, right = n - 1, answer = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (a[mid] >= target) {
                if (a[mid] == target) answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        cout << answer << '\n';
    }
    return 0;
}
