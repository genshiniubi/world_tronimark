#include <bits/stdc++.h>
using namespace std;

template <typename T>
T maximum(const vector<T>& values) {
    // TODO: 返回最大值
    return values[0];
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << maximum(values) << '\n';
    return 0;
}
