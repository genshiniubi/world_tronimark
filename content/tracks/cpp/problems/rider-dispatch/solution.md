# 外卖骑手调度 · 题解

## 思路

维护一个大小为 k 的大根堆。每读入一个耗时就入堆并累加；堆超过 k 时，弹出最大值并从总和中减去。最后堆里就是最小的 k 个。

## C++17 参考代码

```cpp
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
```

## 常见错误

- 用升序排序后取前 k 个也可以，但没必要保存全部。
- 总和用 int 可能溢出。
