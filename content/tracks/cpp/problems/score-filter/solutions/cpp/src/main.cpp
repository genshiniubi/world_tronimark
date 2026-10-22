#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> scores(n);
    for (int& score : scores) cin >> score;
    vector<int> passed;
    copy_if(scores.begin(), scores.end(), back_inserter(passed),
            [](int score) { return score >= 60; });
    sort(passed.begin(), passed.end(), greater<int>());
    if (passed.empty()) {
        cout << "EMPTY\n";
    } else {
        for (size_t i = 0; i < passed.size(); ++i) {
            if (i) cout << ' ';
            cout << passed[i];
        }
        cout << '\n';
    }
    return 0;
}
