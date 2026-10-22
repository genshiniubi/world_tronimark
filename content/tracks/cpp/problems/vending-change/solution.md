# 自动售货机的找零 · 题解

## 思路

先判断支付是否足够，然后按面额从大到小贪心拆分。先取 10 元，余数再取 5 元，最后剩下的都是 1 元。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int paid, price;
    cin >> paid >> price;
    if (paid < price) {
        cout << "ERROR\n";
        return 0;
    }
    int change = paid - price;
    int tens = change / 10;
    change %= 10;
    int fives = change / 5;
    change %= 5;
    cout << (paid - price) << ' ' << tens << ' ' << fives << ' ' << change << '\n';
    return 0;
}
```

## 常见错误

- 输出时把已经改变的 change 当成总额。
- 忘记处理支付不足。
