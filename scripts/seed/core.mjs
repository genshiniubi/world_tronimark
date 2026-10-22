import path from 'node:path';
import { CONTENT, resetDir, writeJson, writeText } from './helpers.mjs';

const taxonomy = {
  knowledgePoints: [
    { id: 'cpp-io', title: '输入输出', description: 'cin / cout、getline 与格式化输出。' },
    { id: 'cpp-variables', title: '变量与类型', description: 'int、long long、double、char、string 的表示与转换。' },
    { id: 'cpp-arithmetic', title: '算术与格式化', description: '整数除法、取模、浮点误差与 fixed/setprecision。' },
    { id: 'cpp-conditions', title: '条件分支', description: 'if / else if / switch 与边界判断。' },
    { id: 'cpp-loops', title: '循环', description: 'for、while、范围 for、循环边界与累计器。' },
    { id: 'cpp-functions', title: '函数', description: '参数、返回值、作用域与按引用传递。' },
    { id: 'cpp-recursion', title: '递归', description: '递归出口、递归式与调用栈。' },
    { id: 'cpp-arrays', title: '数组与 vector', description: '下标、遍历、动态数组和常见越界问题。' },
    { id: 'cpp-strings', title: '字符串', description: 'string、getline、字符判断与字符串处理。' },
    { id: 'cpp-references', title: '引用', description: 'T&、const T& 与原地修改。' },
    { id: 'cpp-pointers', title: '指针', description: '地址、解引用、nullptr 与生命周期。' },
    { id: 'cpp-structs', title: '结构体', description: '把相关字段组织成自定义类型。' },
    { id: 'cpp-stl', title: 'STL 容器', description: 'vector、map、set、queue、priority_queue 的选择。' },
    { id: 'cpp-sort', title: '排序与比较器', description: 'sort、自定义比较、稳定排序与多关键字排序。' },
    { id: 'cpp-oop', title: '类与对象', description: '封装、构造、成员函数与对象状态。' },
    { id: 'cpp-templates', title: '模板与泛型', description: '函数模板、类型参数与泛型代码。' },
    { id: 'cpp-raii', title: 'RAII 与智能指针', description: '资源获取即初始化、unique_ptr 与异常安全。' },
    { id: 'cpp-streams', title: '流与文本处理', description: 'stringstream、getline、文件流与分词。' },
    { id: 'cpp-modern', title: '现代 C++', description: 'auto、范围 for、lambda、constexpr 与现代写法。' },
    { id: 'cpp-window', title: '滑动窗口', description: '双指针维护窗口，处理子串、子数组的连续区间问题。' },
    { id: 'cpp-dsu', title: '并查集', description: '合并集合、查询连通性与路径压缩。' },
    { id: 'cpp-capstone', title: '综合应用', description: '组合容器、类和解析逻辑完成一个小系统。' },
    { id: 'py-io', title: 'Python 输入输出', description: 'input、print、f-string 与类型转换。' },
    { id: 'py-types', title: 'Python 类型', description: 'int、float、str、bool 与动态类型。' },
    { id: 'py-conditions', title: 'Python 条件', description: 'if / elif / else 与真值判断。' },
    { id: 'py-loops', title: 'Python 循环', description: 'for、while、range、enumerate 与 break/continue。' },
    { id: 'py-functions', title: 'Python 函数', description: 'def、参数、返回值、作用域与模块。' },
    { id: 'py-list', title: '列表与元组', description: '下标、切片、推导式与可变/不可变序列。' },
    { id: 'py-dict', title: '字典与集合', description: '键值查找、去重、计数与排序。' },
    { id: 'py-strings', title: '字符串处理', description: 'split、join、strip、replace 与大小写。' },
    { id: 'py-files', title: '文件与路径', description: 'open、with、编码与 pathlib。' },
    { id: 'py-exceptions', title: '异常处理', description: 'try / except / else / finally 与错误恢复。' },
    { id: 'py-oop', title: '面向对象', description: 'class、self、__init__、封装与对象协作。' },
    { id: 'py-generators', title: '生成器', description: 'yield、惰性求值与迭代器协议。' },
    { id: 'py-window', title: '滑动窗口', description: '用双指针和哈希表维护连续区间的约束。' },
    { id: 'py-graph', title: '图与拓扑排序', description: '邻接表、入度、BFS 与有向无环图。' },
    { id: 'py-decorators', title: '装饰器', description: '函数是一等对象、闭包与包装函数。' },
    { id: 'py-stdlib', title: 'Python 标准库', description: 'pathlib、collections、itertools、json、datetime。' },
    { id: 'py-data', title: '数据处理', description: '分组、聚合、排序与简单报表。' },
    { id: 'algo-binary', title: '二分', description: '二分查找、边界收缩与二分答案。' },
    { id: 'algo-dp', title: '动态规划', description: '状态定义、转移方程、初始化与空间优化。' },
    { id: 'algo-sort', title: '排序', description: '排序规则、比较器与多关键字。' },
    { id: 'algo-greedy', title: '贪心', description: '局部最优选择与正确性直觉。' },
    { id: 'algo-graph', title: '图论基础', description: '网格图、BFS、连通性与最短步数。' },
    { id: 'algo-complexity', title: '复杂度', description: '用 O 记号估算时间与空间增长。' },
    { id: 'sys-linux', title: 'Linux 与命令行', description: '路径、权限、管道、进程与常用命令。' },
    { id: 'sys-git', title: 'Git 与版本控制', description: '提交、分支、合并、回滚与协作。' },
    { id: 'sys-network', title: '计算机网络', description: 'IP、DNS、TCP、HTTP 与一次请求的旅程。' },
    { id: 'sys-db', title: '数据库与 SQL', description: '表、索引、查询、事务与数据建模。' },
    { id: 'sys-os', title: '程序如何运行', description: 'CPU、内存、进程、系统调用与编译链接。' },
  ],
};

const cppModules = [
  {
    id: 'cpp-start',
    title: '起步：程序、输入输出',
    summary: '写出第一个可交互程序，理解变量、类型和格式化输出。',
    difficulty: 'beginner',
    order: 1,
    knowledgePoints: ['cpp-io', 'cpp-variables', 'cpp-arithmetic'],
    prerequisites: [],
    lesson: `# 起步：程序、输入输出

## 你会学到
- C++ 程序的基本结构：\`#include\`、\`main\`、\`return 0\`
- 用 \`cin\` 读入、用 \`cout\` 输出
- \`int\`、\`long long\`、\`double\`、\`string\` 的选择
- 用 \`fixed << setprecision(2)\` 控制小数位

## 核心概念
C++ 是静态类型语言：变量在声明时就要确定类型。整数用 \`int\`，较大的计数用 \`long long\`，带小数的金额用 \`double\`。

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int price, count;
    cin >> price >> count;
    cout << price * count << '\\n';
    return 0;
}
\`\`\`

## 常见坑
- 整数除法会截断：\`5 / 2\` 得到 2。
- 金额计算尽量用 \`double\`，输出时固定小数位。
- 读入含空格的整行要用 \`getline\`，而不是 \`cin >>\`。

## 练习建议
先手算样例，再写程序；每道题都问自己：输入可能为空吗？会不会溢出？输出格式是否完全一致？`,
  },
  {
    id: 'cpp-control',
    title: '流程控制：让程序做判断',
    summary: '用条件分支和循环处理规则、累加与边界。',
    difficulty: 'beginner',
    order: 2,
    knowledgePoints: ['cpp-conditions', 'cpp-loops'],
    prerequisites: ['cpp-start'],
    lesson: `# 流程控制

## 你会学到
- \`if / else if / else\` 的多分支写法
- \`for\`、\`while\` 与循环边界
- 累加器、计数器、最大值/最小值的初始化

## 核心概念
分支题先把规则按顺序写全，再考虑合并。循环题先确定“循环变量代表什么”，再写终止条件。

\`\`\`cpp
int sum = 0;
for (int i = 0; i < n; ++i) {
    int value;
    cin >> value;
    sum += value;
}
\`\`\`

## 常见坑
- \`if\` 的顺序会影响结果，范围判断要从窄到宽或从宽到窄统一。
- 求最大值时，初始值不能随便设为 0，输入可能全是负数。
- \`while (cin >> x)\` 适合读到文件末尾。

## 练习建议
在纸上列出 3 组边界输入：最小、最大、特殊值，再运行程序对照。`,
  },
  {
    id: 'cpp-functions',
    title: '函数与递归',
    summary: '把逻辑拆成可复用函数，理解参数传递和递归出口。',
    difficulty: 'easy',
    order: 3,
    knowledgePoints: ['cpp-functions', 'cpp-recursion'],
    prerequisites: ['cpp-control'],
    lesson: `# 函数与递归

## 你会学到
- 函数声明、参数、返回值
- 值传递与引用传递
- 递归的出口和递归式

## 核心概念
函数名应该是一个动词，参数表达“做这件事需要什么”，返回值表达“结果是什么”。

\`\`\`cpp
long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}
\`\`\`

## 常见坑
- 递归必须有出口，否则会栈溢出。
- 大整数乘法/最小公倍数要注意 \`long long\`。
- 修改调用方变量需要引用参数 \`T&\`。

## 练习建议
写完函数后，单独用几个小数据测试它，而不是只测整个程序。`,
  },
  {
    id: 'cpp-data',
    title: '数组与字符串',
    summary: '批量保存数据，处理下标、遍历和字符。',
    difficulty: 'easy',
    order: 4,
    knowledgePoints: ['cpp-arrays', 'cpp-strings'],
    prerequisites: ['cpp-functions'],
    lesson: `# 数组与字符串

## 你会学到
- \`vector<T>\` 的声明、下标和遍历
- 字符串的读入、长度和字符访问
- 统计、去重、回文等常见模式

## 核心概念
\`vector\` 是会自动扩容的数组。下标从 0 开始，最后一个元素是 \`v[v.size() - 1]\`。

\`\`\`cpp
vector<int> scores(n);
for (int& score : scores) cin >> score;
\`\`\`

## 常见坑
- 空数组不能访问 \`v[0]\`。
- \`cin >> s\` 遇到空格停止；整行用 \`getline(cin, s)\`。
- 字符判断可用 \`isalpha\`、\`isdigit\`、\`tolower\`。

## 练习建议
先用一个具体数组手推，再把过程翻译成循环。`,
  },
  {
    id: 'cpp-memory',
    title: '引用、指针与结构体',
    summary: '理解“别名”和“地址”，用结构体组织相关字段。',
    difficulty: 'medium',
    order: 5,
    knowledgePoints: ['cpp-references', 'cpp-pointers', 'cpp-structs'],
    prerequisites: ['cpp-data'],
    lesson: `# 引用、指针与结构体

## 你会学到
- \`T&\` 引用和 \`const T&\` 只读引用
- 指针、\`nullptr\` 和解引用
- \`struct\` 与自定义比较

## 核心概念
引用是已有对象的别名，必须初始化且不能改绑；指针保存地址，可以为空，也可以指向别处。现代 C++ 中，能用引用表达“一定存在”时优先用引用。

\`\`\`cpp
struct Student {
    string name;
    int score;
};
\`\`\`

## 常见坑
- 不要返回局部变量的引用或指针。
- 指针使用前检查是否为 \`nullptr\`。
- 结构体排序时比较器要满足严格弱序。

## 练习建议
每写一个指针，先问：它指向谁？谁负责释放？生命周期够长吗？`,
  },
  {
    id: 'cpp-stl',
    title: 'STL 容器与算法',
    summary: '根据访问方式选择容器，用排序和优先队列解决问题。',
    difficulty: 'medium',
    order: 6,
    knowledgePoints: ['cpp-stl', 'cpp-sort'],
    prerequisites: ['cpp-data'],
    lesson: `# STL 容器与算法

## 你会学到
- \`vector\`、\`map\`、\`set\`、\`priority_queue\` 的适用场景
- \`sort\` 与自定义比较器
- 用哈希表/映射做计数

## 核心概念
先问“我需要按什么访问数据”：
- 按下标：\`vector\`
- 按键查找：\`map\` / \`unordered_map\`
- 去重/有序集合：\`set\`
- 每次取最大/最小：\`priority_queue\`

\`\`\`cpp
sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
    return a.second > b.second;
});
\`\`\`

## 常见坑
- \`priority_queue\` 默认是大根堆，取最小要写比较器。
- 用 \`map\` 下标访问会自动创建键，统计时注意。
- 排序比较器不要写 \`<=\`，会破坏严格弱序。

## 练习建议
同一道题尝试两种容器，比较代码长度和复杂度。`,
  },
  {
    id: 'cpp-oop',
    title: '类与对象',
    summary: '用类封装状态和行为，维护对象的不变量。',
    difficulty: 'medium',
    order: 7,
    knowledgePoints: ['cpp-oop'],
    prerequisites: ['cpp-functions', 'cpp-structs'],
    lesson: `# 类与对象

## 你会学到
- \`class\`、构造函数、成员函数
- \`public\` / \`private\` 与封装
- 用对象维护状态

## 核心概念
类把“数据”和“能对这些数据做的操作”放在一起。对外暴露稳定的方法，对内保护字段。

\`\`\`cpp
class Counter {
public:
    void add(int value) { total_ += value; }
    int total() const { return total_; }
private:
    int total_ = 0;
};
\`\`\`

## 常见坑
- 成员函数不修改对象时加 \`const\`。
- 构造函数要保证对象一创建就是合法状态。
- 不要把本应私有的字段暴露成 public。

## 练习建议
先列出对象需要维护哪些不变量，再设计方法。`,
  },
  {
    id: 'cpp-template',
    title: '模板与泛型',
    summary: '让同一个函数或类适配多种类型。',
    difficulty: 'medium',
    order: 8,
    knowledgePoints: ['cpp-templates'],
    prerequisites: ['cpp-functions'],
    lesson: `# 模板与泛型

## 你会学到
- 函数模板 \`template <typename T>\`
- 类型推导与显式类型参数
- 把“算法”与“类型”分离

## 核心概念
模板让编译器在调用点根据实参类型生成具体代码。它适合“逻辑相同、类型不同”的场景。

\`\`\`cpp
template <typename T>
T maximum(const vector<T>& values) {
    T best = values[0];
    for (const T& value : values) best = max(best, value);
    return best;
}
\`\`\`

## 常见坑
- 模板定义通常放在头文件里。
- 空容器要单独处理。
- 不同类型比较时注意隐式转换。

## 练习建议
先把普通函数写对，再把类型替换成模板参数。`,
  },
  {
    id: 'cpp-raii',
    title: '异常安全与 RAII',
    summary: '让资源跟随对象生命周期自动释放。',
    difficulty: 'hard',
    order: 9,
    knowledgePoints: ['cpp-raii'],
    prerequisites: ['cpp-oop', 'cpp-pointers'],
    lesson: `# 异常安全与 RAII

## 你会学到
- 构造函数获取资源、析构函数释放资源
- \`std::unique_ptr\` 独占所有权
- 异常发生时也能正确清理

## 核心概念
RAII 的核心是：资源的生命周期绑定到对象生命周期。不要手动 \`new/delete\`，优先使用标准容器和智能指针。

\`\`\`cpp
auto data = make_unique<int[]>(n);
for (int i = 0; i < n; ++i) data[i] = i;
\`\`\`

## 常见坑
- \`unique_ptr\` 不能复制，只能移动。
- 不要用两个智能指针管理同一块裸内存。
- 析构函数不要抛出异常。

## 练习建议
把一段使用 \`new/delete\` 的代码改写成标准容器或智能指针。`,
  },
  {
    id: 'cpp-stream',
    title: '流与文本处理',
    summary: '读整行、切分字段、处理日志和格式化文本。',
    difficulty: 'medium',
    order: 10,
    knowledgePoints: ['cpp-streams'],
    prerequisites: ['cpp-strings', 'cpp-stl'],
    lesson: `# 流与文本处理

## 你会学到
- \`getline\` 读整行
- \`stringstream\` 切分字段
- 文件流 \`ifstream\` / \`ofstream\`

## 核心概念
\`cin >>\` 适合格式化读取；\`getline\` 适合整行。混用时注意残留换行符。

\`\`\`cpp
string line;
getline(cin, line);
stringstream ss(line);
string level, message;
ss >> level;
getline(ss, message);
\`\`\`

## 常见坑
- \`cin >> n\` 后立刻 \`getline\` 会读到空行，需要先 \`cin.ignore()\`。
- Windows 文本文件可能有 \`\\r\`，必要时去掉。
- \`stringstream\` 每次复用前要 \`clear()\`。

## 练习建议
先用固定一行日志测试切分，再处理多行输入。`,
  },
  {
    id: 'cpp-modern',
    title: '现代 C++ 工具箱',
    summary: '用 auto、范围 for、lambda 和 constexpr 写出更清晰的代码。',
    difficulty: 'hard',
    order: 11,
    knowledgePoints: ['cpp-modern'],
    prerequisites: ['cpp-stl', 'cpp-functions'],
    lesson: `# 现代 C++ 工具箱

## 你会学到
- \`auto\` 与类型推导
- 范围 for 与 \`const auto&\`
- lambda 表达式与捕获
- \`constexpr\` 与编译期常量

## 核心概念
现代 C++ 的目标不是炫技，而是让意图更明显、资源更安全。优先使用标准库算法和范围 for，减少手写下标。

\`\`\`cpp
vector<int> passed;
copy_if(scores.begin(), scores.end(), back_inserter(passed),
        [](int score) { return score >= 60; });
\`\`\`

## 常见坑
- \`auto\` 会丢掉引用和 const，需要时写 \`const auto&\`。
- lambda 捕获引用时，注意被捕获对象的生命周期。
- 不要把复杂逻辑塞进一个巨型表达式。

## 练习建议
把一段传统循环改写成算法 + lambda，比较可读性。`,
  },
  {
    id: 'cpp-advanced',
    title: '进阶：滑动窗口与并查集',
    summary: '用双指针维护连续区间，用并查集维护连通关系。',
    difficulty: 'hard',
    order: 12,
    knowledgePoints: ['cpp-window', 'cpp-dsu'],
    prerequisites: ['cpp-stl', 'cpp-modern'],
    lesson: `# 滑动窗口与并查集

## 你会学到
- 用左右指针维护一个满足条件的连续区间
- 窗口扩张与收缩的边界
- 并查集的 \`find\` / \`unite\` 与路径压缩
- 什么时候“连续”可以用窗口，什么时候“连通”需要并查集

## 滑动窗口
窗口题先写清楚三件事：
1. 窗口里维护什么状态？
2. 右指针何时扩张？
3. 条件不满足时，左指针收缩到哪里？

\`\`\`cpp
int left = 0, best = 0;
for (int right = 0; right < n; ++right) {
    // 加入 a[right]
    while (/* 窗口不合法 */) {
        // 移出 a[left]
        ++left;
    }
    best = max(best, right - left + 1);
}
\`\`\`

## 并查集
并查集维护“谁和谁在同一组”。\`parent[x]\` 指向父节点，根节点的父节点是它自己。路径压缩让后续查询接近 O(1)。

\`\`\`cpp
int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) parent[a] = b;
}
\`\`\`

## 常见坑
- 窗口收缩后忘记更新计数。
- 并查集只合并、不重新初始化。
- 图的节点编号从 0 还是 1 开始要看题面。

## 练习建议
先手推一个小窗口和一组合并，再把过程翻译成代码。`,
  },
  {
    id: 'cpp-capstone',
    title: '综合项目：库存管理器',
    summary: '把解析、容器、类和边界处理组合成一个可运行的小系统。',
    difficulty: 'challenge',
    order: 13,
    knowledgePoints: ['cpp-capstone', 'cpp-stl', 'cpp-oop'],
    prerequisites: ['cpp-stl', 'cpp-oop', 'cpp-streams'],
    lesson: `# 综合项目：库存管理器

## 你会学到
- 把命令解析成结构化操作
- 用 \`map\` 维护库存状态
- 处理非法操作和边界情况
- 用小函数拆分主流程

## 核心概念
综合题不要一上来写 \`main\`。先列出：
1. 系统状态是什么？
2. 每条命令会改变什么？
3. 失败时输出什么？

\`\`\`cpp
map<string, int> stock;
if (op == "ADD") {
    stock[name] += qty;
    cout << "OK\\n";
}
\`\`\`

## 常见坑
- 库存不足时不能扣成负数。
- 命令参数可能包含空格，读入方式要统一。
- 输出要和题目要求完全一致。

## 练习建议
先实现 ADD/QUERY，再实现 SELL，最后补边界测试。`,
  },
];

const pythonModules = [
  {
    id: 'py-start',
    title: '起步：输入、输出与类型',
    summary: '用 Python 处理输入、做类型转换和格式化输出。',
    difficulty: 'beginner',
    order: 1,
    knowledgePoints: ['py-io', 'py-types'],
    prerequisites: [],
    lesson: `# 起步：输入、输出与类型

## 你会学到
- \`input()\` 读入字符串
- \`int()\`、\`float()\` 类型转换
- f-string 格式化
- \`print()\` 的换行行为

## 核心概念
\`input()\` 永远返回字符串。要做算术，先转换类型。

\`\`\`python
price = int(input())
count = int(input())
total = price * count
print(f"{total:.2f}")
\`\`\`

## 常见坑
- 用 \`split()\` 一次读多个数。
- 金额计算注意浮点误差，输出时格式化。
- 行末空格可能影响判题，尽量按格式输出。

## 练习建议
每次读入后先打印类型和值，确认转换正确。`,
  },
  {
    id: 'py-control',
    title: '条件与循环',
    summary: '用条件分支和循环表达规则与重复操作。',
    difficulty: 'beginner',
    order: 2,
    knowledgePoints: ['py-conditions', 'py-loops'],
    prerequisites: ['py-start'],
    lesson: `# 条件与循环

## 你会学到
- \`if / elif / else\`
- \`for ... in range(...)\`
- \`while\`、\`break\`、\`continue\`
- 计数器和累加器

## 核心概念
Python 用缩进表示代码块。条件判断可以直接使用真值：空列表、空字符串、0 都是假。

\`\`\`python
total = 0
for _ in range(n):
    total += int(input())
print(total)
\`\`\`

## 常见坑
- \`range(n)\` 不包含 n。
- 修改列表时遍历它可能跳过元素。
- 多层条件注意顺序。

## 练习建议
用几个边界值测试条件分支：最小、最大、刚好等于阈值。`,
  },
  {
    id: 'py-functions',
    title: '函数与模块',
    summary: '把逻辑拆成函数，理解参数、返回值和模块。',
    difficulty: 'easy',
    order: 3,
    knowledgePoints: ['py-functions'],
    prerequisites: ['py-control'],
    lesson: `# 函数与模块

## 你会学到
- \`def\`、参数、\`return\`
- 默认参数与关键字参数
- \`import\` 与模块化

## 核心概念
函数把输入映射到输出。好的函数只做一件事，名字能说明意图。

\`\`\`python
def split_bill(total: float, people: int, tip: float = 0.1) -> float:
    return total * (1 + tip) / people
\`\`\`

## 常见坑
- 不要用可变对象做默认参数。
- 函数没有 \`return\` 时返回 \`None\`。
- 注意局部变量和全局变量的区别。

## 练习建议
给函数写 3 个测试用例，再接入主流程。`,
  },
  {
    id: 'py-containers',
    title: '列表、字典与集合',
    summary: '用合适的容器保存、查找和聚合数据。',
    difficulty: 'easy',
    order: 4,
    knowledgePoints: ['py-list', 'py-dict'],
    prerequisites: ['py-functions'],
    lesson: `# 列表、字典与集合

## 你会学到
- list 的下标、切片、append
- dict 的键值查找与 \`get\`
- set 去重
- 列表/字典推导式

## 核心概念
列表适合有序序列；字典适合按键查找；集合适合去重和集合运算。

\`\`\`python
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
\`\`\`

## 常见坑
- 字典的键必须可哈希，列表不能做键。
- 遍历字典时不要同时增删键。
- 排序字典项要用 \`items()\`。

## 练习建议
先问“我需要按位置还是按键访问”，再选容器。`,
  },
  {
    id: 'py-text',
    title: '字符串与文件',
    summary: '清洗文本、切分字段、读写文件。',
    difficulty: 'medium',
    order: 5,
    knowledgePoints: ['py-strings', 'py-files'],
    prerequisites: ['py-containers'],
    lesson: `# 字符串与文件

## 你会学到
- \`strip\`、\`split\`、\`join\`、\`replace\`
- 大小写与字符判断
- \`with open(..., encoding="utf-8")\`
- \`pathlib.Path\`

## 核心概念
文本处理先规范化：去空白、统一大小写、按分隔符切分，再做统计。

\`\`\`python
with open("log.txt", encoding="utf-8") as f:
    lines = [line.strip() for line in f]
\`\`\`

## 常见坑
- Windows 文件默认编码可能不是 UTF-8，读写时显式指定。
- \`strip()\` 会去掉两端空白，不要误删中间内容。
- 文件不存在时抛 \`FileNotFoundError\`。

## 练习建议
先把一行文本切分结果打印出来，再写统计逻辑。`,
  },
  {
    id: 'py-exceptions',
    title: '异常处理',
    summary: '让程序在坏输入下给出可预期的结果。',
    difficulty: 'medium',
    order: 6,
    knowledgePoints: ['py-exceptions'],
    prerequisites: ['py-functions'],
    lesson: `# 异常处理

## 你会学到
- \`try / except / else / finally\`
- 捕获具体异常而不是所有异常
- 用异常表达“无法完成”

## 核心概念
异常不是错误掩盖，而是把“正常流程”和“失败处理”分开。

\`\`\`python
try:
    value = int(text)
except ValueError:
    print("ERROR")
\`\`\`

## 常见坑
- 不要写裸 \`except:\` 吞掉所有错误。
- \`finally\` 总会执行，适合清理资源。
- 除零是 \`ZeroDivisionError\`。

## 练习建议
为每个 \`except\` 写清楚“我在处理什么失败”。`,
  },
  {
    id: 'py-oop',
    title: '面向对象',
    summary: '用类封装状态，让多个方法协同维护对象。',
    difficulty: 'medium',
    order: 7,
    knowledgePoints: ['py-oop'],
    prerequisites: ['py-functions'],
    lesson: `# 面向对象

## 你会学到
- \`class\`、\`__init__\`、\`self\`
- 实例属性与方法
- 封装与对象协作

## 核心概念
类描述“有一类东西”，实例是具体的对象。方法是对象能做的操作。

\`\`\`python
class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
\`\`\`

## 常见坑
- 忘记写 \`self\`。
- 类属性与实例属性混淆。
- 不要让外部代码随意改坏内部状态。

## 练习建议
先画出对象的状态，再写改变状态的方法。`,
  },
  {
    id: 'py-iterators',
    title: '生成器与装饰器',
    summary: '用 yield 惰性产生数据，用装饰器包装函数。',
    difficulty: 'hard',
    order: 8,
    knowledgePoints: ['py-generators', 'py-decorators'],
    prerequisites: ['py-functions', 'py-oop'],
    lesson: `# 生成器与装饰器

## 你会学到
- \`yield\` 与生成器
- 迭代器协议
- 闭包与装饰器
- \`functools.wraps\`

## 核心概念
生成器一次产出一个值，适合大数据流。装饰器接收函数并返回新函数，用来加日志、缓存、计时等横切逻辑。

\`\`\`python
def memoize(fn):
    cache = {}
    def wrapper(n):
        if n not in cache:
            cache[n] = fn(n)
        return cache[n]
    return wrapper
\`\`\`

## 常见坑
- 生成器只能遍历一次。
- 装饰器返回的新函数要保留原函数的元信息。
- 缓存要注意参数是否可哈希。

## 练习建议
先写普通函数，再套一层 wrapper，最后加 \`@decorator\`。`,
  },
  {
    id: 'py-stdlib',
    title: '标准库工具箱',
    summary: '用 pathlib、collections、itertools 等减少重复代码。',
    difficulty: 'medium',
    order: 9,
    knowledgePoints: ['py-stdlib'],
    prerequisites: ['py-containers', 'py-files'],
    lesson: `# 标准库工具箱

## 你会学到
- \`pathlib.Path\` 处理路径
- \`collections.Counter\` 计数
- \`itertools\` 组合与累积
- \`json\` 读写结构化数据

## 核心概念
标准库是 Python 的第一层“外挂”。先查标准库，再考虑第三方包。

\`\`\`python
from collections import Counter
counts = Counter(words)
print(counts.most_common(1))
\`\`\`

## 常见坑
- \`most_common\` 的并列项顺序要额外排序。
- 路径拼接用 \`Path / "file"\`，不要手写分隔符。
- JSON 的键必须是字符串。

## 练习建议
每道题先想：标准库里有没有现成工具？`,
  },
  {
    id: 'py-data',
    title: '数据处理入门',
    summary: '分组、聚合、排序，生成一份小型报表。',
    difficulty: 'hard',
    order: 10,
    knowledgePoints: ['py-data', 'py-dict'],
    prerequisites: ['py-containers', 'py-stdlib'],
    lesson: `# 数据处理入门

## 你会学到
- 用字典做分组聚合
- 多关键字排序
- 输出稳定的报表格式
- 数据清洗的基本步骤

## 核心概念
数据处理的核心是“分组键 + 聚合函数”。先明确每一行代表什么，再决定按什么分组。

\`\`\`python
totals = {}
for product, amount in rows:
    totals[product] = totals.get(product, 0) + amount
for product, total in sorted(totals.items(), key=lambda x: (-x[1], x[0])):
    print(product, total)
\`\`\`

## 常见坑
- 排序要明确升降序和并列规则。
- 金额不要用浮点数累加太多，必要时用整数分。
- 输出前统一格式。

## 练习建议
先做分组，再做排序，最后做格式化，分三步验证。`,
  },
  {
    id: 'py-advanced',
    title: '进阶：滑动窗口与拓扑排序',
    summary: '用窗口处理连续子串，用入度和队列处理依赖关系。',
    difficulty: 'hard',
    order: 11,
    knowledgePoints: ['py-window', 'py-graph'],
    prerequisites: ['py-containers', 'py-oop'],
    lesson: `# 滑动窗口与拓扑排序

## 你会学到
- 用左右指针维护“最多 K 个不同字符”的窗口
- 用字典记录窗口内字符次数
- 用入度表和队列做拓扑排序
- 如何判断有向图是否存在环

## 滑动窗口
窗口题的模板是“右进左出”：

\`\`\`python
left = 0
counts = {}
best = 0
for right, ch in enumerate(s):
    counts[ch] = counts.get(ch, 0) + 1
    while len(counts) > k:
        left_ch = s[left]
        counts[left_ch] -= 1
        if counts[left_ch] == 0:
            del counts[left_ch]
        left += 1
    best = max(best, right - left + 1)
\`\`\`

## 拓扑排序
拓扑排序处理“先做 A 才能做 B”的依赖。每次取入度为 0 的节点，删除它的出边，再把新的入度 0 节点入队。

\`\`\`python
from collections import deque
queue = deque(i for i in range(1, n + 1) if indegree[i] == 0)
while queue:
    node = queue.popleft()
    order.append(node)
    for nxt in graph[node]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            queue.append(nxt)
\`\`\`

## 常见坑
- 窗口收缩时没有删除计数为 0 的键。
- 拓扑排序结束后仍有节点未输出，说明有环。
- 队列换成优先队列可以输出字典序最小的拓扑序。

## 练习建议
先手推一个窗口和一个依赖图，再写代码验证。`,
  },
];

const algorithmModules = [
  {
    id: 'algo-binary',
    title: '二分查找与二分答案',
    summary: '在有序空间中缩小范围，把“可行性”转化为二分问题。',
    difficulty: 'medium',
    order: 1,
    knowledgePoints: ['algo-binary', 'algo-complexity'],
    prerequisites: [],
    lesson: `# 二分查找与二分答案

## 你会学到
- 标准二分查找的边界写法
- 二分答案：把最优化问题变成判定问题
- 复杂度 O(log n) 的直觉

## 核心概念
二分的关键不是背模板，而是明确：
1. 搜索空间是什么？
2. 哪个条件具有单调性？
3. 循环结束时 left/right 代表什么？

\`\`\`cpp
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) left = mid + 1;
    else right = mid - 1;
}
\`\`\`

## 常见坑
- \`mid = (left + right) / 2\` 可能溢出。
- 边界更新写错会死循环。
- 二分答案的 check 函数必须单调。

## 练习建议
每道题都写出“答案范围”和“check 单调性”再编码。`,
  },
  {
    id: 'algo-dp',
    title: '动态规划入门',
    summary: '定义状态、写转移、处理初始化和空间优化。',
    difficulty: 'hard',
    order: 2,
    knowledgePoints: ['algo-dp', 'algo-complexity'],
    prerequisites: ['algo-binary'],
    lesson: `# 动态规划入门

## 你会学到
- 状态定义与转移方程
- 初始化与遍历顺序
- 0/1 背包与空间优化

## 核心概念
动态规划 = 把大问题拆成重叠子问题，并保存子问题答案。先写清楚 \`dp[i]\` 的含义，再写转移。

\`\`\`cpp
dp[0] = 1;
for (int i = 1; i <= n; ++i) {
    dp[i] = dp[i - 1] + (i >= 2 ? dp[i - 2] : 0);
}
\`\`\`

## 常见坑
- 状态含义不清，转移一定混乱。
- 0/1 背包压缩空间时，容量要倒序遍历。
- 计数题注意取模。

## 练习建议
先用二维表手推 5 个状态，再写代码。`,
  },
  {
    id: 'algo-greedy',
    title: '贪心与区间',
    summary: '用排序和局部最优选择解决区间、分配类问题。',
    difficulty: 'hard',
    order: 3,
    knowledgePoints: ['algo-greedy', 'algo-sort', 'algo-complexity'],
    prerequisites: ['algo-binary'],
    lesson: `# 贪心与区间

## 你会学到
- 区间调度：按结束时间排序
- 双指针分配：饼干与孩子
- 如何用交换论证说明贪心是对的

## 核心概念
贪心不是“随便选一个”，而是先证明每一步的局部最优不会破坏全局最优。

### 最多不重叠区间
按结束时间升序，每次选结束最早且与上一个不冲突的区间。

\`\`\`cpp
sort(intervals.begin(), intervals.end(),
     [](auto& a, auto& b) { return a.second < b.second; });
int lastEnd = -1, count = 0;
for (auto& [start, end] : intervals) {
    if (start >= lastEnd) {
        lastEnd = end;
        ++count;
    }
}
\`\`\`

### 分发饼干
把孩子的胃口和饼干尺寸都排序，用最小的能满足当前孩子的饼干。

## 常见坑
- 区间按开始时间排序，往往得不到最优。
- 边界相等时是否能接上，要看题目是否允许端点重合。
- 贪心前先确认数据范围，避免用 DP 处理本可以贪心的问题。

## 练习建议
先手推 3 组区间，再尝试交换两个选择，看看结果会不会更差。`,
  },
  {
    id: 'algo-graph',
    title: '图论入门：网格与最短路',
    summary: '用 BFS 在网格上求连通块和最短步数。',
    difficulty: 'hard',
    order: 4,
    knowledgePoints: ['algo-graph', 'algo-binary', 'algo-complexity'],
    prerequisites: ['algo-binary'],
    lesson: `# 图论入门：网格与最短路

## 你会学到
- 把网格看成图：每个格子是节点，上下左右是边
- 用 BFS 求无权图最短路径
- 用 visited 防止重复入队

## 核心概念
网格题的四个方向：

\`\`\`cpp
int dx[4] = {-1, 1, 0, 0};
int dy[4] = {0, 0, -1, 1};
\`\`\`

BFS 的队列里存“当前坐标 + 步数”。第一次到达终点时就是最短步数。

## 常见坑
- 入队时没有标记 visited，导致重复和超时。
- 边界检查写反。
- 把障碍物当成可走节点。

## 练习建议
先在纸上画出 BFS 的层，再写代码。`,
  },
];

const systemModules = [
  {
    id: 'sys-linux',
    title: 'Linux 与命令行',
    summary: '路径、文件、权限、管道与进程，建立和操作系统对话的手感。',
    difficulty: 'beginner',
    order: 1,
    knowledgePoints: ['sys-linux'],
    prerequisites: [],
    lesson: `# Linux 与命令行

## 命令行不是黑框
命令行是一个可组合的工作台。每个命令做一件小事，通过管道把结果交给下一个命令。

\`\`\`bash
ps aux | grep python | head
\`\`\`

## 路径
- 绝对路径：\`/home/me/project\`
- 相对路径：\`./src/main.cpp\`、\`../data.csv\`
- \`~\` 是当前用户的家目录
- \`.\` 当前目录，\`..\` 上级目录

## 常用命令
| 目的 | 命令 |
|---|---|
| 看目录 | \`ls -la\` |
| 切目录 | \`cd path\` |
| 看文件 | \`cat file\` / \`less file\` |
| 查找 | \`find . -name "*.py"\` / \`grep -rn "TODO" .\` |
| 权限 | \`chmod +x run.sh\` |
| 进程 | \`ps aux\` / \`kill PID\` |
| 空间 | \`df -h\` / \`du -sh *\` |

## 权限的三个数字
\`rwx\` 分别对应读、写、执行。\`chmod 755 file\` 表示：

- 所有者：4+2+1 = 7
- 同组：4+1 = 5
- 其他人：4+1 = 5

## 自查
1. 如何查看一个目录下所有 \`.log\` 文件的大小？
2. \`command > out.txt\` 和 \`command >> out.txt\` 有什么区别？
3. 为什么不要直接 \`chmod 777\` 一个生产文件？

> 提示：\`du -sh *.log\`；\`>\` 覆盖，\`>>\` 追加；777 让所有人都能写，风险很高。`,
  },
  {
    id: 'sys-git',
    title: 'Git 与版本控制',
    summary: '提交、分支、合并、回滚，把“改坏了”变成可恢复。',
    difficulty: 'easy',
    order: 2,
    knowledgePoints: ['sys-git'],
    prerequisites: ['sys-linux'],
    lesson: `# Git 与版本控制

## 三个区域
- 工作区：你正在编辑的文件
- 暂存区：准备提交的改动
- 仓库：已经提交的历史

\`\`\`bash
git status
git add src/main.cpp
git commit -m "feat: add sliding window solution"
\`\`\`

## 分支
分支是一条独立的提交线。开发新功能时开分支，完成后再合并：

\`\`\`bash
git switch -c feature/window
# ...修改...
git add .
git commit -m "feat: implement window"
git switch main
git merge feature/window
\`\`\`

## 回滚
- 撤销工作区改动：\`git restore file\`
- 撤销暂存：\`git restore --staged file\`
- 生成一个反向提交：\`git revert <commit>\`
- 不要对已经推送的公共历史使用 \`reset --hard\`

## 提交信息
推荐格式：

\`\`\`text
type(scope): summary

why this change is needed
\`\`\`

常见 type：\`feat\`、\`fix\`、\`docs\`、\`refactor\`、\`test\`。

## 自查
1. \`git add\` 和 \`git commit\` 分别在做什么？
2. 为什么 \`revert\` 比 \`reset --hard\` 更适合公共分支？
3. 合并冲突时，你实际需要决定什么？`,
  },
  {
    id: 'sys-network',
    title: '网络基础：一次请求的旅程',
    summary: '从 URL 到 DNS、TCP、HTTP，理解浏览器和后端之间发生了什么。',
    difficulty: 'medium',
    order: 3,
    knowledgePoints: ['sys-network'],
    prerequisites: ['sys-linux'],
    lesson: `# 网络基础：一次请求的旅程

## 输入 URL 之后
1. 浏览器解析 URL，确定协议、域名、端口、路径
2. DNS 把域名解析成 IP
3. 与服务器建立 TCP 连接（HTTPS 还要 TLS 握手）
4. 发送 HTTP 请求
5. 服务器返回状态码、响应头和响应体
6. 浏览器渲染页面

## 常见状态码
- \`200\` 成功
- \`301/302\` 重定向
- \`400\` 请求格式错误
- \`401/403\` 未认证 / 无权限
- \`404\` 资源不存在
- \`500\` 服务端错误

## HTTP 与 HTTPS
HTTPS 在 HTTP 之下加了 TLS：它提供加密、完整性校验和身份认证。不要在没有 HTTPS 的页面里提交密码。

## 本地开发中的地址
- \`127.0.0.1\` 和 \`localhost\` 都指向本机
- \`3001\` 是端口，不是路径
- 前端 5173 通过代理把 \`/api\` 转发到 3001

## 自查
1. DNS 解决什么问题？
2. 为什么 API 返回 404 不一定是“服务器挂了”？
3. 浏览器和 API 同源时，为什么不需要 CORS？`,
  },
  {
    id: 'sys-db',
    title: '数据库与 SQL 基础',
    summary: '表、索引、查询、事务，理解数据如何被可靠地保存。',
    difficulty: 'medium',
    order: 4,
    knowledgePoints: ['sys-db'],
    prerequisites: ['sys-network'],
    lesson: `# 数据库与 SQL 基础

## 关系模型
一张表由行和列组成。主键唯一标识一行，外键表达表之间的关系。

\`\`\`sql
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY,
  learner_id TEXT NOT NULL,
  problem_id TEXT NOT NULL,
  verdict TEXT NOT NULL,
  created_at TEXT NOT NULL
);
\`\`\`

## 查询
\`\`\`sql
SELECT problem_id, COUNT(*) AS attempts
FROM submissions
WHERE learner_id = ?
GROUP BY problem_id
ORDER BY attempts DESC;
\`\`\`

执行顺序可以粗略理解为：\`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT\`。

## 索引
索引像书的目录。它加速查询，但会增加写入成本。给经常出现在 \`WHERE\`、\`JOIN\`、\`ORDER BY\` 中的列建索引，不要给每一列都建。

## 事务
事务把多条操作打包成“要么全成功，要么全失败”：

\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

## 自查
1. 主键和唯一索引有什么区别？
2. 为什么 \`SELECT *\` 在生产查询里通常不推荐？
3. 转账为什么需要事务？`,
  },
  {
    id: 'sys-os',
    title: '程序如何运行',
    summary: '从源码到进程：编译、链接、内存、系统调用和调度。',
    difficulty: 'hard',
    order: 5,
    knowledgePoints: ['sys-os'],
    prerequisites: ['sys-linux'],
    lesson: `# 程序如何运行

## 从源码到可执行文件
1. 预处理：展开头文件、宏
2. 编译：生成汇编
3. 汇编：生成目标文件
4. 链接：把目标文件和库组合成可执行文件

C++ 的 \`g++ main.cpp -o app\` 背后完成了这些步骤。

## 进程与内存
进程是运行中的程序，拥有自己的虚拟地址空间。常见区域：

- 代码段：机器指令
- 数据段 / BSS：全局与静态变量
- 堆：\`new\` / \`malloc\` 动态分配
- 栈：函数调用、局部变量

栈由系统自动管理，堆需要程序显式管理。C++ 用 RAII 把堆资源的生命周期绑定到对象。

## 系统调用
程序不能直接操作硬件。读文件、发网络包、创建进程都要通过系统调用进入内核，例如 \`read\`、\`write\`、\`open\`、\`fork\`。

## 并发
操作系统通过时间片让多个进程轮流使用 CPU。并发提高了资源利用率，也带来了竞态条件，需要锁、原子操作或消息传递来协调。

## 自查
1. 编译和链接分别解决什么问题？
2. 栈和堆的生命周期有什么不同？
3. 为什么多线程修改同一个计数器可能出错？`,
  },
];

const tracks = [
  {
    id: 'cpp',
    title: 'C++ 从入门到工程实践',
    subtitle: '从第一行代码到容器、类与 RAII',
    description:
      '面向零基础到进阶的 C++ 学习路径。每个模块先读知识卡，再用真实情景题练习，最后通过判题和 AI 复盘巩固。',
    kind: 'coding',
    language: 'cpp',
    accent: '#2f6bff',
    icon: 'cpp',
    order: 1,
    modules: cppModules,
  },
  {
    id: 'python',
    title: 'Python 从入门到数据处理',
    subtitle: '用更少的代码解决真实问题',
    description:
      '从输入输出、容器到生成器、标准库和数据处理。题目覆盖生活、商业、文本和系统场景，强调可读性与工程习惯。',
    kind: 'coding',
    language: 'python',
    accent: '#1f9d63',
    icon: 'python',
    order: 2,
    modules: pythonModules,
  },
  {
    id: 'algorithms',
    title: '算法专题：二分、贪心与图',
    subtitle: '把套路变成可解释的思考过程',
    description:
      '语言无关的算法专项训练，同时提供 C++ 与 Python 起始代码。每道题都要求写清搜索空间、状态定义和复杂度。',
    kind: 'coding',
    accent: '#8b5cf6',
    icon: 'algorithm',
    order: 3,
    modules: algorithmModules,
  },
  {
    id: 'systems',
    title: '系统基础',
    subtitle: '从命令行到数据库，理解程序脚下的地基',
    description:
      '一条不写代码也能练的知识路径：Linux、Git、网络、数据库和操作系统。每个模块都有知识卡、动手命令和自查问题。',
    kind: 'knowledge',
    accent: '#0f766e',
    icon: 'terminal',
    order: 4,
    modules: systemModules,
  },
];

function trackFile(track) {
  return {
    id: track.id,
    title: track.title,
    subtitle: track.subtitle,
    description: track.description,
    kind: track.kind,
    ...(track.language ? { language: track.language } : {}),
    accent: track.accent,
    icon: track.icon,
    order: track.order,
    modules: track.modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      difficulty: module.difficulty,
      order: module.order,
      knowledgePoints: module.knowledgePoints,
      prerequisites: module.prerequisites,
    })),
  };
}

export async function seedCore() {
  await writeJson(path.join(CONTENT, 'registry.json'), {
    tracks: tracks.map((track) => track.id),
  });
  await writeJson(path.join(CONTENT, 'taxonomy.json'), taxonomy);
  for (const track of tracks) {
    const trackDir = path.join(CONTENT, 'tracks', track.id);
    await resetDir(trackDir);
    await writeJson(path.join(trackDir, 'track.json'), trackFile(track));
    for (const module of track.modules) {
      await writeText(
        path.join(trackDir, 'modules', module.id, 'lesson.md'),
        module.lesson,
      );
    }
  }

  const site = {
    name: '我敲，拟码',
    tagline: '从第一行代码，到独立完成一个项目',
    description:
      '以练代学的编程学习平台。用真实情景题、即时判题和 AI 复盘，把 C++ 与 Python 的知识点连成一条可走的路。',
    email: 'hello@codelab.dev',
    wechat: 'codelab-support',
    github: 'https://github.com/your-name/codelab',
    sponsor: {
      intro: '如果这个项目对你有帮助，欢迎扫码随意赞助。',
      tiers: [],
      qrNote: '当前为示例二维码，替换为你的收款码即可。',
    },
  };
  await writeJson(path.join(CONTENT, 'site', 'site.json'), site);
  await writeText(
    path.join(CONTENT, 'site', 'about.md'),
    `我敲，拟码是一个“以练代学”的编程学习网站。我们相信，理解一个知识点最好的方式，是把它放进一个具体情景里，写出来、跑起来、改到通过。

## 我们在做什么

- 把 C++、Python 的知识点拆成可执行的模块与题目
- 用真实业务、生活、游戏、系统和算法情景出题
- 让判题结果、编译错误、失败用例和 AI 复盘组成学习闭环
- 为后续语言、算法专题和系统知识体系保留扩展空间

## 设计原则

1. **先动手，再解释**：每道题都有明确输入输出和可运行反馈。
2. **不隐藏过程**：编译错误、失败用例和尝试次数都可以回看。
3. **AI 是助教，不是判官**：通过与否由真实测试决定。
4. **内容可扩展**：新增语言或知识体系只需要增加内容与适配器。

## 现在与以后

当前版本聚焦 C++ 与 Python 两条主线和算法专题。后续会加入更多语言、计算机系统基础、工程项目和多文件综合任务。

如果你愿意参与共建题目、校对题解或提供真实场景，欢迎通过“联系服务”找到我们。`,
  );
  await writeText(
    path.join(CONTENT, 'site', 'contact.md'),
    `如果有问题、建议或合作想法，欢迎发邮件。`,
  );
  await writeText(
    path.join(CONTENT, 'site', 'sponsor.md'),
    `如果我敲，拟码对你有帮助，欢迎扫码随意赞助。

赞助完全自愿，不影响任何题目、判题或 AI 功能的使用。`,
  );
  console.log('core content generated');
}
