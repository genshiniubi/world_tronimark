# 仓库库存盘点 · 题解

## 思路

一次遍历完成全部统计。总和用 long long，最大值/最小值初始化为整数极值，遇到每个元素时更新四个统计量。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = INT_MIN, minimum = INT_MAX, zeroCount = 0;
    for (int i = 0; i < n; ++i) {
        int value;
        cin >> value;
        sum += value;
        maximum = max(maximum, value);
        minimum = min(minimum, value);
        if (value == 0) ++zeroCount;
    }
    cout << sum << ' ' << maximum << ' ' << minimum << ' ' << zeroCount << '\n';
    return 0;
}
```

## 常见错误

- 最大值初始化为 0，遇到全负数会出错。
- 总和用 int 可能溢出。
