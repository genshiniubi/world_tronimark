# 成绩筛选 · 题解

## 思路

copy_if 按谓词筛选，back_inserter 把结果追加到新 vector，sort 配合 greater<int> 完成降序。lambda 把“及格”这个业务规则直接写在筛选处。

## C++17 参考代码

```cpp
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
```

## 常见错误

- 忘记处理空结果。
- 降序写成默认升序。
- copy_if 没有 back_inserter。
