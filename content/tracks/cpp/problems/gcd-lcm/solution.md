# 最大公约数与最小公倍数 · 题解

## 思路

欧几里得算法利用 gcd(a,b)=gcd(b,a%b)，递归到 b=0 时返回 a。最小公倍数等于 a/gcd(a,b)×b，先除后乘避免中间结果溢出。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

int main() {
    long long a, b;
    cin >> a >> b;
    long long g = gcd(a, b);
    cout << g << ' ' << (a / g) * b << '\n';
    return 0;
}
```

## 常见错误

- 递归没有出口。
- 先乘后除导致 long long 溢出。
- 使用 int 存储 lcm。
