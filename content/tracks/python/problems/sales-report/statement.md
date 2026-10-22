# 销售报表

> 数据分析 · 22 分钟 · 知识点：py-data、py-dict

## 情景

门店导出了一些销售流水，每行是一条商品销售记录。店长想要一份按商品汇总的销售额报表。

## 任务

按商品汇总金额，按总金额降序输出；金额相同按商品名升序。

## 输入格式

第一行 n。接下来 n 行，每行 `product amount`。

## 输出格式

每行 `product total`，按规则排序。

## 样例

### 样例 1

**输入**

```text
5
apple 10
banana 20
apple 5
cherry 20
banana 1
```

**输出**

```text
banana 21
cherry 20
apple 15
```

**解释**：banana 21、cherry 20、apple 15，按金额降序排列。

## 数据范围

1 ≤ n ≤ 100000，1 ≤ amount ≤ 10^6，商品名不含空格。

## 知识点

`py-data` · `py-dict`
