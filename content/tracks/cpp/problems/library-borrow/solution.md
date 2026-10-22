# 图书馆借阅 · 题解

## 思路

Library 类内部用 map 保存每本书的可借数量。借书成功时数量减一，还书成功时数量加一；不存在的 id 统一返回 false。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

class Library {
public:
    void addBook(int id, int copies) {
        copies_[id] += copies;
    }

    bool borrow(int id) {
        auto it = copies_.find(id);
        if (it == copies_.end() || it->second <= 0) return false;
        --it->second;
        return true;
    }

    bool giveBack(int id) {
        auto it = copies_.find(id);
        if (it == copies_.end()) return false;
        ++it->second;
        return true;
    }

private:
    map<int, int> copies_;
};

int main() {
    int n;
    cin >> n;
    Library library;
    for (int i = 0; i < n; ++i) {
        int id, copies;
        cin >> id >> copies;
        library.addBook(id, copies);
    }
    int m;
    cin >> m;
    while (m--) {
        string op;
        int id;
        cin >> op >> id;
        if (op == "BORROW") cout << (library.borrow(id) ? "OK" : "NO") << '\n';
        else cout << (library.giveBack(id) ? "OK" : "NO") << '\n';
    }
    return 0;
}
```

## 常见错误

- 借书时没有检查数量。
- 还书时给不存在的 id 创建了记录。
- 输出 OK/NO 大小写不一致。
