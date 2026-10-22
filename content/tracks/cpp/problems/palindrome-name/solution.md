# 回文昵称 · 题解

## 思路

先统一转成小写，再用双指针从两端向中间比较。只要有一对字符不相等，就不是回文。时间复杂度 O(n)，额外空间 O(1)。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    for (char& ch : s) ch = tolower(ch);
    bool ok = true;
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            ok = false;
            break;
        }
        ++left;
        --right;
    }
    cout << (ok ? "YES" : "NO") << '\n';
    return 0;
}
```

## 常见错误

- 忘记大小写统一。
- 循环条件写成 left <= right，导致中间字符被误判。
