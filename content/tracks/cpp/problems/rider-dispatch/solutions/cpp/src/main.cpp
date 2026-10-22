#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int> heap;
    long long sum = 0;
    for (int i = 0; i < n; ++i) {
        int value;
        cin >> value;
        heap.push(value);
        sum += value;
        if ((int)heap.size() > k) {
            sum -= heap.top();
            heap.pop();
        }
    }
    cout << sum << '\n';
    return 0;
}
