# STL 容器与算法

## 你会学到
- `vector`、`map`、`set`、`priority_queue` 的适用场景
- `sort` 与自定义比较器
- 用哈希表/映射做计数

## 核心概念
先问“我需要按什么访问数据”：
- 按下标：`vector`
- 按键查找：`map` / `unordered_map`
- 去重/有序集合：`set`
- 每次取最大/最小：`priority_queue`

```cpp
sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
    return a.second > b.second;
});
```

## 常见坑
- `priority_queue` 默认是大根堆，取最小要写比较器。
- 用 `map` 下标访问会自动创建键，统计时注意。
- 排序比较器不要写 `<=`，会破坏严格弱序。

## 练习建议
同一道题尝试两种容器，比较代码长度和复杂度。
