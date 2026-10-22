# 聊天词频统计 · 题解

## 思路

用 map 统计频率，再把 map 的键值对复制到 vector 中排序。排序规则先比较次数降序，次数相同再比较单词字典序。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> counts;
    for (int i = 0; i < n; ++i) {
        string word;
        cin >> word;
        ++counts[word];
    }
    vector<pair<string, int>> items(counts.begin(), counts.end());
    sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) return a.second > b.second;
        return a.first < b.first;
    });
    for (const auto& item : items) cout << item.first << ' ' << item.second << '\n';
    return 0;
}
```

## 常见错误

- 只按次数排序，导致并列项顺序不稳定。
- 直接对 map 排序，map 本身按 key 有序。
