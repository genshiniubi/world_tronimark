# 日志清洗

> 系统工具 · 15 分钟 · 知识点：py-strings、py-files

## 情景

服务日志里混着各种级别。运维同学只关心错误数量，并希望忽略行首尾空白。

## 任务

读取 n 行日志，统计以 ERROR 开头的行数。

## 输入格式

第一行 n。接下来 n 行，每行 `LEVEL message`。

## 输出格式

一行一个整数，表示 ERROR 行数。

## 样例

### 样例 1

**输入**

```text
3
ERROR disk full
WARN memory high
  ERROR retry
```

**输出**

```text
2
```

**解释**：两行以 ERROR 开头（忽略前导空格）。

## 数据范围

1 ≤ n ≤ 100000，每行长度不超过 200。

## 知识点

`py-strings` · `py-files`
