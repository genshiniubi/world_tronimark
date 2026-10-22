# 数据库与 SQL 基础

## 关系模型
一张表由行和列组成。主键唯一标识一行，外键表达表之间的关系。

```sql
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY,
  learner_id TEXT NOT NULL,
  problem_id TEXT NOT NULL,
  verdict TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

## 查询
```sql
SELECT problem_id, COUNT(*) AS attempts
FROM submissions
WHERE learner_id = ?
GROUP BY problem_id
ORDER BY attempts DESC;
```

执行顺序可以粗略理解为：`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`。

## 索引
索引像书的目录。它加速查询，但会增加写入成本。给经常出现在 `WHERE`、`JOIN`、`ORDER BY` 中的列建索引，不要给每一列都建。

## 事务
事务把多条操作打包成“要么全成功，要么全失败”：

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

## 自查
1. 主键和唯一索引有什么区别？
2. 为什么 `SELECT *` 在生产查询里通常不推荐？
3. 转账为什么需要事务？
