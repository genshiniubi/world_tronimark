# 快递运费计算器 · 题解

## 思路

把规则写进函数：首重 10 元，超出部分每公斤 5 元，加急再加 8 元。main 只负责读入和调用，便于单独测试函数。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int deliveryFee(int weight, bool express) {
    int fee = 10 + (weight - 1) * 5;
    if (express) fee += 8;
    return fee;
}

int main() {
    int weight;
    char express;
    cin >> weight >> express;
    cout << deliveryFee(weight, express == 'Y') << '\n';
    return 0;
}
```

## 常见错误

- 把 weight 当成超出部分，导致多算一公斤。
- 把 Y/N 当成字符串读入。
