#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<int,int>> intervals(n);
    for (auto& item : intervals) cin >> item.first >> item.second;
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a.second < b.second; });
    int count = 0, lastEnd = -1;
    for (const auto& interval : intervals) {
        int start = interval.first, end = interval.second;
        if (start >= lastEnd) {
            ++count;
            lastEnd = end;
        }
    }
    cout << count << '\n';
    return 0;
}
