# 木材切割 · 题解

## 思路

二分长度 L。L 越大，能切出的段数越少，因此“段数 ≥ k”具有单调性。每次 check 线性统计段数，总复杂度 O(n log maxLength)。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> lengths(n);
    for (long long& x : lengths) cin >> x;
    long long left = 1, right = *max_element(lengths.begin(), lengths.end());
    long long answer = 0;
    while (left <= right) {
        long long mid = left + (right - left) / 2;
        long long pieces = 0;
        for (long long length : lengths) pieces += length / mid;
        if (pieces >= k) {
            answer = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << answer << '\n';
    return 0;
}
```

## Python 3 参考代码

```python
n, k = map(int, input().split())
lengths = list(map(int, input().split()))

left, right = 1, max(lengths)
answer = 0
while left <= right:
    mid = left + (right - left) // 2
    pieces = sum(length // mid for length in lengths)
    if pieces >= k:
        answer = mid
        left = mid + 1
    else:
        right = mid - 1
print(answer)
```

## 常见错误

- check 里除以 0。
- 段数用 int 溢出。
- 二分方向写反。
