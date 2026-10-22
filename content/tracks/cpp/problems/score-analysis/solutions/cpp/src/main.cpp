#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = INT_MIN, minimum = INT_MAX, passCount = 0;
    for (int i = 0; i < n; ++i) {
        int score;
        cin >> score;
        sum += score;
        maximum = max(maximum, score);
        minimum = min(minimum, score);
        if (score >= 60) ++passCount;
    }
    cout << fixed << setprecision(2) << (double)sum / n << ' '
         << maximum << ' ' << minimum << ' ' << passCount << '\n';
    return 0;
}
