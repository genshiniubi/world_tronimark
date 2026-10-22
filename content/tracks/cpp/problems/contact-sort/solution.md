# 通讯录排序 · 题解

## 思路

结构体把姓名和年龄组织成一个整体。排序比较器先比较年龄，年龄相同再比较姓名。比较器必须满足严格弱序。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Person {
    string name;
    int age;
};

int main() {
    int n;
    cin >> n;
    vector<Person> people(n);
    for (Person& p : people) cin >> p.name >> p.age;
    sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        if (a.age != b.age) return a.age < b.age;
        return a.name < b.name;
    });
    for (const Person& p : people) cout << p.name << ' ' << p.age << '\n';
    return 0;
}
```

## 常见错误

- 比较器写成 <=，可能导致排序行为未定义。
- 只按年龄排序，没有处理同岁情况。
