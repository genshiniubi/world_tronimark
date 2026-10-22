# 滑动窗口与并查集

## 你会学到
- 用左右指针维护一个满足条件的连续区间
- 窗口扩张与收缩的边界
- 并查集的 `find` / `unite` 与路径压缩
- 什么时候“连续”可以用窗口，什么时候“连通”需要并查集

## 滑动窗口
窗口题先写清楚三件事：
1. 窗口里维护什么状态？
2. 右指针何时扩张？
3. 条件不满足时，左指针收缩到哪里？

```cpp
int left = 0, best = 0;
for (int right = 0; right < n; ++right) {
    // 加入 a[right]
    while (/* 窗口不合法 */) {
        // 移出 a[left]
        ++left;
    }
    best = max(best, right - left + 1);
}
```

## 并查集
并查集维护“谁和谁在同一组”。`parent[x]` 指向父节点，根节点的父节点是它自己。路径压缩让后续查询接近 O(1)。

```cpp
int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) parent[a] = b;
}
```

## 常见坑
- 窗口收缩后忘记更新计数。
- 并查集只合并、不重新初始化。
- 图的节点编号从 0 还是 1 开始要看题面。

## 练习建议
先手推一个小窗口和一组合并，再把过程翻译成代码。
