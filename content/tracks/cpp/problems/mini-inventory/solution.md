# 综合项目：小型库存管理器 · 题解

## 思路

用 map 保存每个商品的库存。ADD 累加；SELL 先检查再扣减；QUERY 直接输出（map 下标访问对不存在的键返回 0）。命令读取顺序要和输入格式一致。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, long long> stock;
    while (n--) {
        string op, name;
        cin >> op >> name;
        if (op == "ADD") {
            long long qty;
            cin >> qty;
            stock[name] += qty;
            cout << "OK\n";
        } else if (op == "SELL") {
            long long qty;
            cin >> qty;
            if (stock[name] >= qty) {
                stock[name] -= qty;
                cout << "OK\n";
            } else {
                cout << "NO\n";
            }
        } else {
            cout << stock[name] << '\n';
        }
    }
    return 0;
}
```

## 常见错误

- SELL 库存不足仍扣成负数。
- QUERY 也去读 qty，导致后续命令错位。
- qty 用 int 存储大数。
