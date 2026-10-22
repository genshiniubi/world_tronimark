#include <bits/stdc++.h>
using namespace std;

int deliveryFee(int weight, bool express) {
    int fee = 10 + (weight - 1) * 5;
    if (express) fee += 8;
    return fee;
}

int main() {
    int weight;
    char express;
    cin >> weight >> express;
    cout << deliveryFee(weight, express == 'Y') << '\n';
    return 0;
}
