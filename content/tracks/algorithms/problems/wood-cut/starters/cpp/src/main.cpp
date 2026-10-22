#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> lengths(n);
    for (long long& x : lengths) cin >> x;
    long long left = 1, right = *max_element(lengths.begin(), lengths.end());
    long long answer = 0;
    // TODO: 二分答案
    cout << answer << '\n';
    return 0;
}
