# 字符串与文件

## 你会学到
- `strip`、`split`、`join`、`replace`
- 大小写与字符判断
- `with open(..., encoding="utf-8")`
- `pathlib.Path`

## 核心概念
文本处理先规范化：去空白、统一大小写、按分隔符切分，再做统计。

```python
with open("log.txt", encoding="utf-8") as f:
    lines = [line.strip() for line in f]
```

## 常见坑
- Windows 文件默认编码可能不是 UTF-8，读写时显式指定。
- `strip()` 会去掉两端空白，不要误删中间内容。
- 文件不存在时抛 `FileNotFoundError`。

## 练习建议
先把一行文本切分结果打印出来，再写统计逻辑。
