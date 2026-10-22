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
            if (stock[name] >= qty) {
                stock[name] -= qty;
                cout << "OK\n";
            } else {
                cout << "NO\n";
            }
        } else {
            cout << stock[name] << '\n';
        }
    }
    return 0;
}
