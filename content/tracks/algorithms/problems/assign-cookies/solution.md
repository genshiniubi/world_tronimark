# 分发饼干 · 题解

## 思路

把胃口和饼干都升序排序。用两个指针，如果当前饼干能满足当前孩子，就同时前进；否则这块饼干太小，只能换下一块。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<long long> greed(n), cookies(m);
    for (auto& x : greed) cin >> x;
    for (auto& x : cookies) cin >> x;
    sort(greed.begin(), greed.end());
    sort(cookies.begin(), cookies.end());
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (cookies[j] >= greed[i]) ++i;
        ++j;
    }
    cout << i << '\n';
    return 0;
}
```

## Python 3 参考代码

```python
n, m = map(int, input().split())
greed = sorted(map(int, input().split()))
cookies = sorted(map(int, input().split()))

i = j = 0
while i < n and j < m:
    if cookies[j] >= greed[i]:
        i += 1
    j += 1
print(i)
```

## 常见错误

- 用大饼干去满足小胃口，浪费资源。
- 饼干指针在满足孩子时忘记前进。
