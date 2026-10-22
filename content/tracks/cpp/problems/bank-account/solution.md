# 银行账户 · 题解

## 思路

Account 类维护私有余额，对外提供 deposit、withdraw、balance 三个方法。withdraw 先检查余额，再决定是否扣款并返回结果。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

class Account {
public:
    void deposit(long long amount) {
        balance_ += amount;
    }

    bool withdraw(long long amount) {
        if (amount > balance_) return false;
        balance_ -= amount;
        return true;
    }

    long long balance() const {
        return balance_;
    }

private:
    long long balance_ = 0;
};

int main() {
    int n;
    cin >> n;
    Account account;
    while (n--) {
        string op;
        cin >> op;
        if (op == "DEPOSIT") {
            long long x;
            cin >> x;
            account.deposit(x);
            cout << "OK\n";
        } else if (op == "WITHDRAW") {
            long long x;
            cin >> x;
            cout << (account.withdraw(x) ? "OK" : "ERROR") << '\n';
        } else {
            cout << account.balance() << '\n';
        }
    }
    return 0;
}
```

## 常见错误

- 取款失败仍然扣款。
- 余额用 int 存储大额操作。
- 余额字段设为 public，外部随意修改。
