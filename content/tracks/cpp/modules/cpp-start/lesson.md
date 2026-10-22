# 起步：程序、输入输出

## 你会学到
- C++ 程序的基本结构：`#include`、`main`、`return 0`
- 用 `cin` 读入、用 `cout` 输出
- `int`、`long long`、`double`、`string` 的选择
- 用 `fixed << setprecision(2)` 控制小数位

## 核心概念
C++ 是静态类型语言：变量在声明时就要确定类型。整数用 `int`，较大的计数用 `long long`，带小数的金额用 `double`。

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int price, count;
    cin >> price >> count;
    cout << price * count << '\n';
    return 0;
}
```

## 常见坑
- 整数除法会截断：`5 / 2` 得到 2。
- 金额计算尽量用 `double`，输出时固定小数位。
- 读入含空格的整行要用 `getline`，而不是 `cin >>`。

## 练习建议
先手算样例，再写程序；每道题都问自己：输入可能为空吗？会不会溢出？输出格式是否完全一致？
