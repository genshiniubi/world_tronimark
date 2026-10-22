# 银行账户（Python）

> 金融账单 · 20 分钟 · 知识点：py-oop

## 情景

一个简易银行系统需要处理账户操作。取款不能透支；每次操作都要给出明确结果。

## 任务

实现 Account 类，处理 n 条命令。

## 输入格式

第一行 n。接下来 n 行，每行 `DEPOSIT x`、`WITHDRAW x` 或 `BALANCE`。初始余额为 0。

## 输出格式

DEPOSIT 和成功的 WITHDRAW 输出 OK；余额不足的 WITHDRAW 输出 ERROR；BALANCE 输出余额。

## 样例

### 样例 1

**输入**

```text
6
DEPOSIT 100
WITHDRAW 30
BALANCE
WITHDRAW 100
DEPOSIT 20
BALANCE
```

**输出**

```text
OK
OK
70
ERROR
OK
90
```

## 数据范围

1 ≤ n ≤ 100000，0 ≤ x ≤ 10^9。

## 知识点

`py-oop`
