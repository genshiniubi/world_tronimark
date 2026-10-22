# 日志级别统计 · 题解

## 思路

先用 cin.ignore 清掉整数后的换行，再循环 getline 读整行。用 stringstream 取出第一个单词作为级别，分别计数。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    int errors = 0, warns = 0, infos = 0;
    for (int i = 0; i < n; ++i) {
        string line;
        getline(cin, line);
        stringstream ss(line);
        string level;
        ss >> level;
        if (level == "ERROR") ++errors;
        else if (level == "WARN") ++warns;
        else if (level == "INFO") ++infos;
    }
    cout << "ERROR " << errors << '\n';
    cout << "WARN " << warns << '\n';
    cout << "INFO " << infos << '\n';
    return 0;
}
```

## 常见错误

- cin >> n 后直接 getline 会读到空行。
- 只读第一个单词导致描述丢失。
