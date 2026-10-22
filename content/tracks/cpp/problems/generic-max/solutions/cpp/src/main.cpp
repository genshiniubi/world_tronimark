#include <bits/stdc++.h>
using namespace std;

template <typename T>
T maximum(const vector<T>& values) {
    T best = values[0];
    for (const T& value : values) {
        if (value > best) best = value;
    }
    return best;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << maximum(values) << '\n';
    return 0;
}
