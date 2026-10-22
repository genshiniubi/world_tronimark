# 爬楼梯 · 题解

## 思路

定义 dp[i] 为到达第 i 级的方案数。最后一步可能走 1 级或 2 级，因此 dp[i] = dp[i-1] + dp[i-2]。初始化 dp[0]=1、dp[1]=1。

## C++17 参考代码

```cpp
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
```

## Python 3 参考代码

```python
n = int(input())
MOD = 1000000007
dp = [0] * (n + 1)
dp[0] = 1
if n >= 1:
    dp[1] = 1
for i in range(2, n + 1):
    dp[i] = (dp[i - 1] + dp[i - 2]) % MOD
print(dp[n])
```

## 常见错误

- dp[0] 初始化为 0 导致结果偏小。
- 忘记取模。
- n=1 时访问 dp[2] 越界。
