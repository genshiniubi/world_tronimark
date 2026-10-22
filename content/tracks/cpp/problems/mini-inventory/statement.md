# 综合项目：小型库存管理器

> 商业零售 · 30 分钟 · 知识点：cpp-capstone、cpp-stl、cpp-oop、cpp-streams

## 情景

一家小商店需要一个命令行库存管理器。店员可以入库、销售和查询商品数量。

## 任务

实现一个库存系统，处理 n 条命令。

## 输入格式

第一行 n。接下来 n 行，格式为 `ADD name qty`、`SELL name qty` 或 `QUERY name`。name 不含空格，qty 为正整数。

## 输出格式

ADD 成功输出 OK；SELL 库存足够输出 OK，否则输出 NO；QUERY 输出当前数量，不存在输出 0。

## 样例

### 样例 1

**输入**

```text
7
ADD apple 10
SELL apple 3
QUERY apple
SELL apple 10
ADD pear 5
QUERY pear
QUERY banana
```

**输出**

```text
OK
OK
7
NO
OK
5
0
```

**解释**：apple 入库 10，卖出 3 剩 7；再卖 10 失败；pear 入库 5；banana 不存在。

## 数据范围

1 ≤ n ≤ 100000，1 ≤ qty ≤ 10^9，商品名长度不超过 30。

## 知识点

`cpp-capstone` · `cpp-stl` · `cpp-oop` · `cpp-streams`
