# 最多不重叠区间 · 题解

## 思路

按结束时间从早到晚排序，每次选择结束最早且不与已选区间冲突的会议。这样给后面的会议留下最大的时间空间，是区间调度的经典贪心。

## C++17 参考代码

```cpp
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
```

## Python 3 参考代码

```python
n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]
intervals.sort(key=lambda x: x[1])

count = 0
last_end = -1
for start, end in intervals:
    if start >= last_end:
        count += 1
        last_end = end
print(count)
```

## 常见错误

- 按开始时间排序，可能错过更优选择。
- 端点相等时错误地判为冲突。
