#include <bits/stdc++.h>
using namespace std;

void swapEnds(vector<int>& a) {
    if (a.size() >= 2) swap(a.front(), a.back());
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;
    swapEnds(a);
    for (int i = 0; i < n; ++i) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}
