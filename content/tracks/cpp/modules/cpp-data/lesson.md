# 数组与字符串

## 你会学到
- `vector<T>` 的声明、下标和遍历
- 字符串的读入、长度和字符访问
- 统计、去重、回文等常见模式

## 核心概念
`vector` 是会自动扩容的数组。下标从 0 开始，最后一个元素是 `v[v.size() - 1]`。

```cpp
vector<int> scores(n);
for (int& score : scores) cin >> score;
```

## 常见坑
- 空数组不能访问 `v[0]`。
- `cin >> s` 遇到空格停止；整行用 `getline(cin, s)`。
- 字符判断可用 `isalpha`、`isdigit`、`tolower`。

## 练习建议
先用一个具体数组手推，再把过程翻译成循环。
