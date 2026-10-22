#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int,int>> intervals(n);
    for (auto& item : intervals) cin >> item.first >> item.second;
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a.second < b.second; });
    int count = 0, lastEnd = -1;
    // TODO: 贪心选择区间
    cout << count << '\n';
    return 0;
}
