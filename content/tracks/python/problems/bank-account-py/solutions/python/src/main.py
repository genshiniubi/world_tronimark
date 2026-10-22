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
