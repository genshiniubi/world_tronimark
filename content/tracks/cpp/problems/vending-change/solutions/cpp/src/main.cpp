#include <bits/stdc++.h>
using namespace std;

int main() {
    int paid, price;
    cin >> paid >> price;
    if (paid < price) {
        cout << "ERROR\n";
        return 0;
    }
    int change = paid - price;
    int tens = change / 10;
    change %= 10;
    int fives = change / 5;
    change %= 5;
    cout << (paid - price) << ' ' << tens << ' ' << fives << ' ' << change << '\n';
    return 0;
}
