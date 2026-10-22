#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, long long> stock;
    while (n--) {
        string op, name;
        cin >> op >> name;
        if (op == "ADD") {
            long long qty;
            cin >> qty;
            stock[name] += qty;
            cout << "OK\n";
        } else if (op == "SELL") {
            long long qty;
            cin >> qty;
            // TODO: 判断库存并扣减
            cout << "NO\n";
        } else {
            // TODO: 输出当前库存
            cout << 0 << '\n';
        }
    }
    return 0;
}
