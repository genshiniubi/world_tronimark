#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<int> last(26, -1);
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); ++right) {
        int ch = s[right] - 'a';
        left = max(left, last[ch] + 1);
        last[ch] = right;
        best = max(best, right - left + 1);
    }
    cout << best << '\n';
    return 0;
}
