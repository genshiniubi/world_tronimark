# 成绩分析 · 题解

## 思路

一次遍历即可完成总和、最值和及格人数统计。平均分在输出时再除，避免每一步都做浮点运算。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = INT_MIN, minimum = INT_MAX, passCount = 0;
    for (int i = 0; i < n; ++i) {
        int score;
        cin >> score;
        sum += score;
        maximum = max(maximum, score);
        minimum = min(minimum, score);
        if (score >= 60) ++passCount;
    }
    cout << fixed << setprecision(2) << (double)sum / n << ' '
         << maximum << ' ' << minimum << ' ' << passCount << '\n';
    return 0;
}
```

## 常见错误

- 平均分用整数除法。
- 及格人数条件写成 >60。
- 最值初始化不适合数据范围。
