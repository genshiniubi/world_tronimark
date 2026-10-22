#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = INT_MIN, minimum = INT_MAX, zeroCount = 0;
    for (int i = 0; i < n; ++i) {
        int value;
        cin >> value;
        sum += value;
        maximum = max(maximum, value);
        minimum = min(minimum, value);
        if (value == 0) ++zeroCount;
    }
    cout << sum << ' ' << maximum << ' ' << minimum << ' ' << zeroCount << '\n';
    return 0;
}
