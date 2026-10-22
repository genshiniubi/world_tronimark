#include <bits/stdc++.h>
using namespace std;

long long gcd(long long a, long long b) {
    // TODO: 递归或循环实现
    return 1;
}

int main() {
    long long a, b;
    cin >> a >> b;
    long long g = gcd(a, b);
    cout << g << ' ' << (a / g) * b << '\n';
    return 0;
}
