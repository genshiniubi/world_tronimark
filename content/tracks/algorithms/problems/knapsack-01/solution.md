# 0/1 背包 · 题解

## 思路

dp[c] 表示容量 c 下能获得的最大价值。每件物品只能选一次，因此容量必须从大到小更新，避免同一件物品被重复使用。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, capacity;
    cin >> n >> capacity;
    vector<long long> dp(capacity + 1, 0);
    for (int i = 0; i < n; ++i) {
        int weight, value;
        cin >> weight >> value;
        for (int c = capacity; c >= weight; --c) {
            dp[c] = max(dp[c], dp[c - weight] + value);
        }
    }
    cout << dp[capacity] << '\n';
    return 0;
}
```

## Python 3 参考代码

```python
n, capacity = map(int, input().split())
dp = [0] * (capacity + 1)
for _ in range(n):
    weight, value = map(int, input().split())
    for c in range(capacity, weight - 1, -1):
        dp[c] = max(dp[c], dp[c - weight] + value)
print(dp[capacity])
```

## 常见错误

- 容量正序遍历，变成完全背包。
- weight > capacity 时数组越界。
- 价值用 int 溢出（本题范围内 long long 更稳）。
