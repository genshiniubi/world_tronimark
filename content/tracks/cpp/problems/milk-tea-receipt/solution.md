# 奶茶店订单小票 · 题解

## 思路

先把单价和数量相乘得到原价，再按百分比计算折扣。实付金额 = 原价 × (100 - discount) / 100。使用 double 避免整数除法丢失小数，输出时固定两位小数。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int price, count, discount;
    cin >> price >> count >> discount;
    double subtotal = price * count;
    double total = subtotal * (100 - discount) / 100.0;
    cout << fixed << setprecision(2) << total << '\n';
    return 0;
}
```

## 常见错误

- 忘记使用 double，导致折扣被整数除法截断。
- 没有设置 fixed 和 setprecision。
