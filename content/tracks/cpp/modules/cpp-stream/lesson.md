# 流与文本处理

## 你会学到
- `getline` 读整行
- `stringstream` 切分字段
- 文件流 `ifstream` / `ofstream`

## 核心概念
`cin >>` 适合格式化读取；`getline` 适合整行。混用时注意残留换行符。

```cpp
string line;
getline(cin, line);
stringstream ss(line);
string level, message;
ss >> level;
getline(ss, message);
```

## 常见坑
- `cin >> n` 后立刻 `getline` 会读到空行，需要先 `cin.ignore()`。
- Windows 文本文件可能有 `\r`，必要时去掉。
- `stringstream` 每次复用前要 `clear()`。

## 练习建议
先用固定一行日志测试切分，再处理多行输入。
