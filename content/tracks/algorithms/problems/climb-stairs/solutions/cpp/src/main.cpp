#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    const long long MOD = 1000000007;
    vector<long long> dp(n + 1);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; ++i) {
        dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
    }
    cout << dp[n] << '\n';
    return 0;
}
