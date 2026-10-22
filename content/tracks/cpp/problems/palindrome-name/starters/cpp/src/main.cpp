#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    for (char& ch : s) ch = tolower(ch);
    // TODO: 判断 s 是否为回文
    bool ok = true;
    cout << (ok ? "YES" : "NO") << '\n';
    return 0;
}
