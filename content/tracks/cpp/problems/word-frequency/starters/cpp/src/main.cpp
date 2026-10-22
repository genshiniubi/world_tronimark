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
    // TODO: 排序并输出
    return 0;
}
