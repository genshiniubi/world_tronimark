#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, capacity;
    cin >> n >> capacity;
    vector<long long> dp(capacity + 1, 0);
    for (int i = 0; i < n; ++i) {
        int weight, value;
        cin >> weight >> value;
        // TODO: 0/1 背包转移
    }
    cout << dp[capacity] << '\n';
    return 0;
}
