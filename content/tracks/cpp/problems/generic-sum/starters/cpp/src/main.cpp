#include <bits/stdc++.h>
using namespace std;

template <typename T>
T sum(const vector<T>& values) {
    // TODO: 求和
    return T{};
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << sum(values) << '\n';
    return 0;
}
