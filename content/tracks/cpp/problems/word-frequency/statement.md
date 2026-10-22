# 聊天词频统计

> 文本处理 · 18 分钟 · 知识点：cpp-stl、cpp-sort

## 情景

运营同学想从群聊的高频词里找出大家都在讨论什么。请统计每个单词出现的次数。

## 任务

按出现次数从高到低排序；次数相同按单词字典序升序。

## 输入格式

第一行 n。第二行 n 个不含空格的单词。

## 输出格式

每行一个 `word count`。

## 样例

### 样例 1

**输入**

```text
5
apple banana apple cherry banana
```

**输出**

```text
apple 2
banana 2
cherry 1
```

**解释**：apple 和 banana 都是 2 次，按字典序 apple 在前。

### 样例 2

**输入**

```text
1
hello
```

**输出**

```text
hello 1
```

## 数据范围

1 ≤ n ≤ 100000，单词只含小写英文字母，长度不超过 30。

## 知识点

`cpp-stl` · `cpp-sort`
