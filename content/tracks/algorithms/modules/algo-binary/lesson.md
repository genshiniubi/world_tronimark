# 二分查找与二分答案

## 你会学到
- 标准二分查找的边界写法
- 二分答案：把最优化问题变成判定问题
- 复杂度 O(log n) 的直觉

## 核心概念
二分的关键不是背模板，而是明确：
1. 搜索空间是什么？
2. 哪个条件具有单调性？
3. 循环结束时 left/right 代表什么？

```cpp
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

## 常见坑
- `mid = (left + right) / 2` 可能溢出。
- 边界更新写错会死循环。
- 二分答案的 check 函数必须单调。

## 练习建议
每道题都写出“答案范围”和“check 单调性”再编码。
