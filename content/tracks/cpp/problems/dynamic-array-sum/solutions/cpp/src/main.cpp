#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    auto data = make_unique<int[]>(n);
    long long total = 0;
    for (int i = 0; i < n; ++i) {
        cin >> data[i];
        total += data[i];
    }
    cout << total << '\n';
    return 0;
}
