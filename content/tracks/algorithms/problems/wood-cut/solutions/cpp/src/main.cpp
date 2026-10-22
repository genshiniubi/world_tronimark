#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> lengths(n);
    for (long long& x : lengths) cin >> x;
    long long left = 1, right = *max_element(lengths.begin(), lengths.end());
    long long answer = 0;
    while (left <= right) {
        long long mid = left + (right - left) / 2;
        long long pieces = 0;
        for (long long length : lengths) pieces += length / mid;
        if (pieces >= k) {
            answer = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << answer << '\n';
    return 0;
}
