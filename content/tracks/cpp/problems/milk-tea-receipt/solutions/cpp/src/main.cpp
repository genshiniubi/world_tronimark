#include <bits/stdc++.h>
using namespace std;

int main() {
    int price, count, discount;
    cin >> price >> count >> discount;
    double subtotal = price * count;
    double total = subtotal * (100 - discount) / 100.0;
    cout << fixed << setprecision(2) << total << '\n';
    return 0;
}
