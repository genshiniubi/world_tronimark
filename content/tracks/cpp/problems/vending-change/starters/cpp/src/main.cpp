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
    // TODO: 计算三种面额的数量
    int tens = 0, fives = 0, ones = 0;
    cout << change << ' ' << tens << ' ' << fives << ' ' << ones << '\n';
    return 0;
}
