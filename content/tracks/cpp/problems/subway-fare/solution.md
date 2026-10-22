# 地铁票价规则 · 题解

## 思路

把规则按里程从小到大写成 if / else if 链。每个分支只需要判断当前区间的上界，因为前面的条件已经把更小的里程排除掉了。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int distance;
    cin >> distance;
    int fare;
    if (distance <= 6) fare = 3;
    else if (distance <= 12) fare = 4;
    else if (distance <= 22) fare = 5;
    else fare = 6;
    cout << fare << '\n';
    return 0;
}
```

## 常见错误

- 把 6 和 12 这样的边界分到错误区间。
- 所有分支都没有覆盖时 fare 仍是默认值。
