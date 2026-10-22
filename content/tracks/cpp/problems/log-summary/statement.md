# 日志级别统计

> 系统工具 · 18 分钟 · 知识点：cpp-streams、cpp-strings

## 情景

运维同学需要快速了解一段服务日志的严重程度分布。日志每行以级别开头，后面是描述。

## 任务

统计三种日志级别出现的次数。

## 输入格式

第一行 n。接下来 n 行，每行 `LEVEL message`。级别只会是 ERROR、WARN、INFO。

## 输出格式

三行，依次为 `ERROR x`、`WARN y`、`INFO z`。

## 样例

### 样例 1

**输入**

```text
3
ERROR disk full
WARN memory high
INFO started
```

**输出**

```text
ERROR 1
WARN 1
INFO 1
```

## 数据范围

1 ≤ n ≤ 100000，每行长度不超过 200。

## 知识点

`cpp-streams` · `cpp-strings`
