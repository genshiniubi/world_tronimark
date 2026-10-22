#include <bits/stdc++.h>
using namespace std;

template <typename T>
T sum(const vector<T>& values) {
    T total{};
    for (const T& value : values) total += value;
    return total;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << sum(values) << '\n';
    return 0;
}
