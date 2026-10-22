# 交换首尾元素 · 题解

## 思路

引用参数让函数直接操作调用方的 vector，而不是复制一份。n≥2 时交换首尾，n=1 时保持不变。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

void swapEnds(vector<int>& a) {
    if (a.size() >= 2) swap(a.front(), a.back());
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;
    swapEnds(a);
    for (int i = 0; i < n; ++i) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}
```

## 常见错误

- 参数按值传递，修改没有作用到原数组。
- 空数组访问首尾元素。
