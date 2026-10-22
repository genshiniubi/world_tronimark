#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    for (char& ch : s) ch = tolower(ch);
    bool ok = true;
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            ok = false;
            break;
        }
        ++left;
        --right;
    }
    cout << (ok ? "YES" : "NO") << '\n';
    return 0;
}
