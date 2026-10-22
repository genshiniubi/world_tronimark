# 最长无重复子串 · 题解

## 思路

用 last[ch] 记录字符 ch 上一次出现的位置。右指针扫到 ch 时，窗口左边界至少要移动到 last[ch]+1，才能保证窗口内没有重复。每次更新答案。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<int> last(26, -1);
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); ++right) {
        int ch = s[right] - 'a';
        left = max(left, last[ch] + 1);
        last[ch] = right;
        best = max(best, right - left + 1);
    }
    cout << best << '\n';
    return 0;
}
```

## 常见错误

- 左指针直接赋值成 last[ch]+1，可能把窗口向右推回去。
- 字符下标计算错误。
