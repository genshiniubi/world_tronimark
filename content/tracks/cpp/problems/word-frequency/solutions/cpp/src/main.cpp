#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> counts;
    for (int i = 0; i < n; ++i) {
        string word;
        cin >> word;
        ++counts[word];
    }
    vector<pair<string, int>> items(counts.begin(), counts.end());
    sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) return a.second > b.second;
        return a.first < b.first;
    });
    for (const auto& item : items) cout << item.first << ' ' << item.second << '\n';
    return 0;
}
