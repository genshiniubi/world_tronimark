# 有序数组查找 · 题解

## 思路

标准二分找到相等元素后不立即返回，而是继续把 right 收缩到 mid-1，记录最后一次相等的位置，从而得到最左下标。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (long long& x : a) cin >> x;
    while (q--) {
        long long target;
        cin >> target;
        int left = 0, right = n - 1, answer = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (a[mid] >= target) {
                if (a[mid] == target) answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        cout << answer << '\n';
    }
    return 0;
}
```

## Python 3 参考代码

```python
n, q = map(int, input().split())
a = list(map(int, input().split()))
queries = list(map(int, input().split()))

for target in queries:
    left, right = 0, n - 1
    answer = -1
    while left <= right:
        mid = left + (right - left) // 2
        if a[mid] >= target:
            if a[mid] == target:
                answer = mid
            right = mid - 1
        else:
            left = mid + 1
    print(answer)
```

## 常见错误

- 找到就返回，无法保证最左。
- mid 使用 (left+right)/2 在大范围下溢出。
