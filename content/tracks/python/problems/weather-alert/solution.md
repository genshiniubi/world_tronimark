# 天气预警 · 题解

## 思路

从最高等级开始判断，使用 `or` 连接温度和风力条件。因为 `elif` 只会执行第一个成立的分支，所以不需要重复排除更高等级。

## Python 3 参考代码

```python
temperature, wind = map(int, input().split())

if temperature >= 35 or wind >= 10:
    print("RED")
elif temperature >= 30 or wind >= 7:
    print("ORANGE")
elif temperature >= 25:
    print("YELLOW")
else:
    print("GREEN")
```

## 常见错误

- 从低到高判断，导致高等级永远不触发。
- 把“或”写成“且”。
