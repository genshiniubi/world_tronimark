# 银行账户（Python） · 题解

## 思路

Account 把余额作为实例属性，deposit 和 withdraw 维护状态。withdraw 先检查余额，失败时返回 False，不改变状态。

## Python 3 参考代码

```python
class Account:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True


n = int(input())
account = Account()
for _ in range(n):
    parts = input().split()
    if parts[0] == "DEPOSIT":
        account.deposit(int(parts[1]))
        print("OK")
    elif parts[0] == "WITHDRAW":
        print("OK" if account.withdraw(int(parts[1])) else "ERROR")
    else:
        print(account.balance)
```

## 常见错误

- 取款失败仍然扣款。
- 忘记写 self。
- 余额字段被外部随意修改。
