# 文件扩展名统计 · 题解

## 思路

`Path(name).suffix` 返回最后一个扩展名（包含点），没有扩展名时返回空字符串。用 `or "none"` 统一成可读的标签，再按 key 排序输出。

## Python 3 参考代码

```python
import sys
from pathlib import Path

n = int(sys.stdin.readline())
names = sys.stdin.read().split()

counts = {}
for name in names:
    ext = Path(name).suffix or "none"
    counts[ext] = counts.get(ext, 0) + 1
for ext, count in sorted(counts.items()):
    print(ext, count)
```

## 常见错误

- 用 split(".") 把文件名中的多个点处理错。
- 扩展名大小写被错误统一。
