# 标准库工具箱

## 你会学到
- `pathlib.Path` 处理路径
- `collections.Counter` 计数
- `itertools` 组合与累积
- `json` 读写结构化数据

## 核心概念
标准库是 Python 的第一层“外挂”。先查标准库，再考虑第三方包。

```python
from collections import Counter
counts = Counter(words)
print(counts.most_common(1))
```

## 常见坑
- `most_common` 的并列项顺序要额外排序。
- 路径拼接用 `Path / "file"`，不要手写分隔符。
- JSON 的键必须是字符串。

## 练习建议
每道题先想：标准库里有没有现成工具？
