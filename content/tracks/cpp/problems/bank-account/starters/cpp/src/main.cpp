#include <bits/stdc++.h>
using namespace std;

class Account {
public:
    void deposit(long long amount) {
        // TODO
    }

    bool withdraw(long long amount) {
        // TODO
        return false;
    }

    long long balance() const {
        // TODO
        return 0;
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
