import { writeProblem } from './helpers.mjs';

const raw = String.raw;
const cpp = (starter, solution) => ({ starter, solution, entry: 'src/main.cpp' });
const python = (starter, solution) => ({ starter, solution, entry: 'src/main.py' });

const problems = [
  {
    track: 'cpp',
    moduleId: 'cpp-advanced',
    id: 'cpp-advanced-01',
    slug: 'longest-unique-substring',
    title: '最长无重复子串',
    order: 21,
    difficulty: 'hard',
    scenario: 'text',
    scenarioLabel: '文本处理',
    knowledgePoints: ['cpp-window', 'cpp-strings'],
    prerequisites: ['cpp-data-02'],
    estimatedMinutes: 20,
    summary: '用滑动窗口求不含重复字符的最长子串长度。',
    statement: {
      scenarioText:
        '内容审核系统需要找出一个昵称中最长的“无重复字符片段”，用来做高亮展示。',
      task: '求字符串 s 中不含重复字符的最长连续子串长度。',
      input: '一行一个只含小写英文字母的字符串 s。',
      output: '一行一个整数，表示最长长度。',
      constraints: '1 ≤ |s| ≤ 200000。',
    },
    samples: [
      { input: 'abcabcbb\n', output: '3\n', explanation: '最长的是 abc。' },
      { input: 'bbbbb\n', output: '1\n' },
    ],
    tests: [
      { input: 'pwwkew\n', output: '3\n' },
      { input: 'abcdef\n', output: '6\n' },
      { input: 'abba\n', output: '2\n' },
      { input: 'a\n', output: '1\n' },
    ],
    hints: [
      '窗口内不能有重复字符。',
      '右指针每次加入 s[right]，用 last 记录字符上次出现的位置。',
      '左指针更新为 max(left, last[ch] + 1)。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<int> last(26, -1);
    int left = 0, best = 0;
    // TODO: 维护无重复字符窗口
    cout << best << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<int> last(26, -1);
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); ++right) {
        int ch = s[right] - 'a';
        left = max(left, last[ch] + 1);
        last[ch] = right;
        best = max(best, right - left + 1);
    }
    cout << best << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '用 last[ch] 记录字符 ch 上一次出现的位置。右指针扫到 ch 时，窗口左边界至少要移动到 last[ch]+1，才能保证窗口内没有重复。每次更新答案。',
    pitfalls: ['左指针直接赋值成 last[ch]+1，可能把窗口向右推回去。', '字符下标计算错误。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-advanced',
    id: 'cpp-advanced-02',
    slug: 'friend-circles',
    title: '朋友圈连通块',
    order: 22,
    difficulty: 'challenge',
    scenario: 'game',
    scenarioLabel: '游戏',
    knowledgePoints: ['cpp-dsu'],
    prerequisites: ['cpp-memory-02'],
    estimatedMinutes: 25,
    summary: '用并查集维护好友关系，统计朋友圈数量。',
    statement: {
      scenarioText:
        '游戏里有 n 个玩家，好友关系具有传递性：A 和 B 是好友、B 和 C 是好友，那么 A、B、C 属于同一个朋友圈。',
      task: '给定 m 对好友关系，输出朋友圈的数量。',
      input: '第一行 n 和 m。接下来 m 行，每行两个整数 u v，表示 u 和 v 是好友。',
      output: '一行一个整数，表示连通块数量。',
      constraints: '1 ≤ n ≤ 200000，0 ≤ m ≤ 200000，1 ≤ u, v ≤ n。',
    },
    samples: [
      {
        input: '5 3\n1 2\n2 3\n4 5\n',
        output: '2\n',
        explanation: '{1,2,3} 和 {4,5}。',
      },
      { input: '4 0\n', output: '4\n' },
    ],
    tests: [
      { input: '3 3\n1 2\n2 3\n1 3\n', output: '1\n' },
      { input: '6 4\n1 2\n3 4\n5 6\n2 3\n', output: '2\n' },
      { input: '1 0\n', output: '1\n' },
    ],
    hints: [
      '初始时每个玩家自己一个集合，答案是 n。',
      '每成功合并两个不同集合，答案减一。',
      'find 时做路径压缩。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

vector<int> parent_;

int find_root(int x) {
    // TODO: 路径压缩
    return x;
}

int main() {
    int n, m;
    cin >> n >> m;
    parent_.resize(n + 1);
    iota(parent_.begin(), parent_.end(), 0);
    int components = n;
    // TODO: 合并好友关系
    cout << components << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

vector<int> parent_;

int find_root(int x) {
    if (parent_[x] == x) return x;
    return parent_[x] = find_root(parent_[x]);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    parent_.resize(n + 1);
    iota(parent_.begin(), parent_.end(), 0);
    int components = n;
    while (m--) {
        int u, v;
        cin >> u >> v;
        int a = find_root(u), b = find_root(v);
        if (a != b) {
            parent_[a] = b;
            --components;
        }
    }
    cout << components << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '并查集初始有 n 个集合。每次读入一条好友边，查找两个端点所在集合；如果不同就合并，并把连通块数量减一。路径压缩让后续查询接近常数。',
    pitfalls: ['合并后没有减少计数。', '把 1-based 节点写成 0-based。', 'find 没有路径压缩，极端数据可能变慢。'],
  },
  {
    track: 'python',
    moduleId: 'py-advanced',
    id: 'py-advanced-01',
    slug: 'at-most-k-distinct',
    title: '最多 K 个不同字符',
    order: 17,
    difficulty: 'hard',
    scenario: 'text',
    scenarioLabel: '文本处理',
    knowledgePoints: ['py-window', 'py-dict'],
    prerequisites: ['py-containers-02'],
    estimatedMinutes: 20,
    summary: '用滑动窗口求最多包含 k 个不同字符的最长子串。',
    statement: {
      scenarioText:
        '搜索团队想从一段关键词里找出“最多包含 k 种不同字符”的最长连续片段，用于展示搜索建议。',
      task: '求字符串 s 中最多包含 k 个不同字符的最长连续子串长度。',
      input: '一行一个字符串 s 和一个整数 k，用空格分隔。s 只含小写字母。',
      output: '一行一个整数，表示最长长度；k=0 时输出 0。',
      constraints: '1 ≤ |s| ≤ 200000，0 ≤ k ≤ 26。',
    },
    samples: [
      { input: 'eceba 2\n', output: '3\n', explanation: 'ece 含 e、c 两种字符。' },
      { input: 'aa 1\n', output: '2\n' },
    ],
    tests: [
      { input: 'abc 3\n', output: '3\n' },
      { input: 'a 0\n', output: '0\n' },
      { input: 'abaccc 2\n', output: '4\n' },
      { input: 'aabbcc 2\n', output: '4\n' },
    ],
    hints: [
      '字典记录窗口内每个字符出现次数。',
      '不同字符数超过 k 时，移动左指针并减少计数。',
      '计数减到 0 时从字典删除该键，len(counts) 才是不同字符数。',
    ],
    languages: {
      python: python(
        `s, k = input().split()
k = int(k)

left = 0
counts = {}
best = 0
# TODO: 维护最多 k 个不同字符的窗口
print(best)`,
        `s, k = input().split()
k = int(k)

left = 0
counts = {}
best = 0
for right, ch in enumerate(s):
    counts[ch] = counts.get(ch, 0) + 1
    while len(counts) > k:
        out = s[left]
        counts[out] -= 1
        if counts[out] == 0:
            del counts[out]
        left += 1
    best = max(best, right - left + 1)
print(best)`,
      ),
    },
    idea:
      '右指针扩张窗口并增加字符计数；当不同字符数超过 k 时，左指针收缩，直到不同字符数回到 k。字典的键数量就是窗口内的不同字符数。',
    pitfalls: ['计数减到 0 后没有删除键。', 'k=0 时窗口长度应为 0。'],
  },
  {
    track: 'python',
    moduleId: 'py-advanced',
    id: 'py-advanced-02',
    slug: 'course-topological',
    title: '课程安排',
    order: 18,
    difficulty: 'challenge',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['py-graph', 'py-dict'],
    prerequisites: ['py-containers-02'],
    estimatedMinutes: 25,
    summary: '用拓扑排序输出字典序最小的课程学习顺序。',
    statement: {
      scenarioText:
        '选课系统里有一些先修关系：学习课程 a 之前必须先完成课程 b。系统需要给出一个合法的学习顺序。',
      task: '输出字典序最小的拓扑序；如果存在环，输出 -1。',
      input:
        '第一行 n 和 m。接下来 m 行，每行两个整数 a b，表示 a 必须在 b 之前完成。课程编号为 1..n。',
      output: '一行 n 个整数，表示合法顺序；无解输出 -1。',
      constraints: '1 ≤ n ≤ 200000，0 ≤ m ≤ 200000。',
    },
    samples: [
      {
        input: '4 3\n1 2\n1 3\n3 4\n',
        output: '1 2 3 4\n',
        explanation: '1 完成后 2、3 都可选，选字典序更小的 2。',
      },
      { input: '3 3\n1 2\n2 3\n3 1\n', output: '-1\n' },
    ],
    tests: [
      { input: '3 2\n2 1\n3 1\n', output: '2 3 1\n' },
      { input: '5 4\n1 2\n1 3\n2 4\n3 4\n', output: '1 2 3 4 5\n' },
      { input: '1 0\n', output: '1\n' },
    ],
    hints: [
      '统计每个节点的入度。',
      '入度为 0 的节点进入优先队列，保证每次取字典序最小的。',
      '输出节点数小于 n 说明有环。',
    ],
    languages: {
      python: python(
        `import heapq
from collections import defaultdict

n, m = map(int, input().split())
graph = defaultdict(list)
indegree = [0] * (n + 1)
# TODO: 建图与统计入度
order = []
print(-1 if len(order) < n else " ".join(map(str, order)))`,
        `import heapq
from collections import defaultdict

n, m = map(int, input().split())
graph = defaultdict(list)
indegree = [0] * (n + 1)
for _ in range(m):
    a, b = map(int, input().split())
    graph[a].append(b)
    indegree[b] += 1

queue = [i for i in range(1, n + 1) if indegree[i] == 0]
heapq.heapify(queue)
order = []
while queue:
    node = heapq.heappop(queue)
    order.append(node)
    for nxt in graph[node]:
        indegree[nxt] -= 1
        if indegree[nxt] == 0:
            heapq.heappush(queue, nxt)

print(-1 if len(order) < n else " ".join(map(str, order)))`,
      ),
    },
    idea:
      '用邻接表保存 a→b，统计每个节点的入度。把所有入度为 0 的节点放入最小堆，每次取出字典序最小的节点，删除它的出边；如果最终没有输出全部节点，说明图中有环。',
    pitfalls: ['使用普通队列，无法保证字典序最小。', '忘记检查环。', '边方向建反。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-greedy',
    id: 'algo-greedy-01',
    slug: 'interval-scheduling',
    title: '最多不重叠区间',
    order: 5,
    difficulty: 'hard',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['algo-greedy', 'algo-sort'],
    prerequisites: ['algo-binary-01'],
    estimatedMinutes: 20,
    summary: '按结束时间排序，选择最多互不重叠的区间。',
    statement: {
      scenarioText:
        '会议室预约系统收到了一批使用申请。每场会议有一个开始和结束时间，同一时间只能安排一场。',
      task: '选择最多数量的互不重叠会议；端点相等视为可以接上。',
      input: '第一行 n。接下来 n 行，每行两个整数 start end。',
      output: '一行一个整数，表示最多会议数。',
      constraints: '1 ≤ n ≤ 200000，0 ≤ start < end ≤ 10^9。',
    },
    samples: [
      {
        input: '3\n1 2\n2 3\n3 4\n',
        output: '3\n',
        explanation: '三场会议首尾相接。',
      },
      { input: '4\n1 4\n2 3\n4 6\n5 7\n', output: '2\n' },
    ],
    tests: [
      { input: '1\n1 10\n', output: '1\n' },
      { input: '5\n1 2\n2 3\n3 4\n4 5\n5 6\n', output: '5\n' },
      { input: '4\n1 3\n2 4\n3 5\n0 2\n', output: '2\n' },
    ],
    hints: ['按结束时间升序。', '选择结束最早的区间，给后面留出最大空间。', '下一个区间的 start 必须 >= 上一个 end。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int,int>> intervals(n);
    for (auto& item : intervals) cin >> item.first >> item.second;
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a.second < b.second; });
    int count = 0, lastEnd = -1;
    // TODO: 贪心选择区间
    cout << count << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<int,int>> intervals(n);
    for (auto& item : intervals) cin >> item.first >> item.second;
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a.second < b.second; });
    int count = 0, lastEnd = -1;
    for (const auto& interval : intervals) {
        int start = interval.first, end = interval.second;
        if (start >= lastEnd) {
            ++count;
            lastEnd = end;
        }
    }
    cout << count << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]
intervals.sort(key=lambda x: x[1])

count = 0
last_end = -1
# TODO: 贪心选择区间
print(count)`,
        solution: `n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]
intervals.sort(key=lambda x: x[1])

count = 0
last_end = -1
for start, end in intervals:
    if start >= last_end:
        count += 1
        last_end = end
print(count)`,
      },
    },
    idea:
      '按结束时间从早到晚排序，每次选择结束最早且不与已选区间冲突的会议。这样给后面的会议留下最大的时间空间，是区间调度的经典贪心。',
    pitfalls: ['按开始时间排序，可能错过更优选择。', '端点相等时错误地判为冲突。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-greedy',
    id: 'algo-greedy-02',
    slug: 'assign-cookies',
    title: '分发饼干',
    order: 6,
    difficulty: 'medium',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['algo-greedy', 'algo-sort'],
    prerequisites: ['algo-greedy-01'],
    estimatedMinutes: 15,
    summary: '用最小的饼干满足尽可能多的孩子。',
    statement: {
      scenarioText:
        '幼儿园有一批饼干和一群孩子。每个孩子有一个胃口值，每块饼干有一个尺寸；只有尺寸不小于胃口时，孩子才会满足。',
      task: '每个孩子最多一块饼干，每块饼干最多给一个孩子，求最多能满足多少个孩子。',
      input: '第一行 n 和 m。第二行 n 个孩子胃口。第三行 m 个饼干尺寸。',
      output: '一行一个整数，表示最多满足人数。',
      constraints: '1 ≤ n, m ≤ 200000，1 ≤ 值 ≤ 10^9。',
    },
    samples: [
      { input: '3 2\n1 2 3\n1 1\n', output: '1\n' },
      { input: '2 3\n1 2\n1 2 3\n', output: '2\n' },
    ],
    tests: [
      { input: '3 3\n10 9 8\n8 9 10\n', output: '3\n' },
      { input: '1 1\n5\n4\n', output: '0\n' },
      { input: '4 4\n1 2 3 4\n1 2 3 4\n', output: '4\n' },
    ],
    hints: ['两个孩子和饼干都排序。', '用两个指针，饼干够就满足当前孩子，两个指针都前进。', '饼干不够时只移动饼干指针。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<long long> greed(n), cookies(m);
    for (auto& x : greed) cin >> x;
    for (auto& x : cookies) cin >> x;
    sort(greed.begin(), greed.end());
    sort(cookies.begin(), cookies.end());
    int i = 0, j = 0;
    // TODO: 双指针分配
    cout << i << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<long long> greed(n), cookies(m);
    for (auto& x : greed) cin >> x;
    for (auto& x : cookies) cin >> x;
    sort(greed.begin(), greed.end());
    sort(cookies.begin(), cookies.end());
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (cookies[j] >= greed[i]) ++i;
        ++j;
    }
    cout << i << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `n, m = map(int, input().split())
greed = sorted(map(int, input().split()))
cookies = sorted(map(int, input().split()))

i = j = 0
# TODO: 双指针分配
print(i)`,
        solution: `n, m = map(int, input().split())
greed = sorted(map(int, input().split()))
cookies = sorted(map(int, input().split()))

i = j = 0
while i < n and j < m:
    if cookies[j] >= greed[i]:
        i += 1
    j += 1
print(i)`,
      },
    },
    idea:
      '把胃口和饼干都升序排序。用两个指针，如果当前饼干能满足当前孩子，就同时前进；否则这块饼干太小，只能换下一块。',
    pitfalls: ['用大饼干去满足小胃口，浪费资源。', '饼干指针在满足孩子时忘记前进。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-graph',
    id: 'algo-graph-01',
    slug: 'islands-count',
    title: '岛屿数量',
    order: 7,
    difficulty: 'medium',
    scenario: 'game',
    scenarioLabel: '游戏',
    knowledgePoints: ['algo-graph'],
    prerequisites: ['algo-greedy-02'],
    estimatedMinutes: 20,
    summary: '在 0/1 网格中统计四连通岛屿数量。',
    statement: {
      scenarioText:
        '一张地图由陆地和海洋组成，1 表示陆地，0 表示海洋。上下左右相连的陆地属于同一座岛屿。',
      task: '统计地图中岛屿的数量。',
      input: '第一行 n 和 m。接下来 n 行，每行一个长度为 m 的 01 字符串。',
      output: '一行一个整数。',
      constraints: '1 ≤ n, m ≤ 1000。',
    },
    samples: [
      {
        input: '4 5\n11000\n11000\n00100\n00011\n',
        output: '3\n',
      },
      { input: '1 1\n0\n', output: '0\n' },
    ],
    tests: [
      { input: '3 3\n111\n010\n111\n', output: '1\n' },
      { input: '2 2\n10\n01\n', output: '2\n' },
      { input: '3 3\n000\n000\n000\n', output: '0\n' },
    ],
    hints: ['遇到 1 就把岛屿数加一。', '从这个格子开始 DFS/BFS，把所有连通的 1 标记为已访问。', '只向上下左右四个方向扩展。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> grid(n);
    for (auto& row : grid) cin >> row;
    int count = 0;
    // TODO: 遍历并淹没岛屿
    cout << count << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<string> grid(n);
    for (auto& row : grid) cin >> row;
    int count = 0;
    int dx[4] = {-1, 1, 0, 0};
    int dy[4] = {0, 0, -1, 1};
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            if (grid[i][j] != '1') continue;
            ++count;
            queue<pair<int,int>> q;
            q.push({i, j});
            grid[i][j] = '0';
            while (!q.empty()) {
                auto point = q.front();
                q.pop();
                int x = point.first, y = point.second;
                for (int d = 0; d < 4; ++d) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
                    if (grid[nx][ny] != '1') continue;
                    grid[nx][ny] = '0';
                    q.push({nx, ny});
                }
            }
        }
    }
    cout << count << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `from collections import deque

n, m = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]
count = 0
# TODO: 遍历并淹没岛屿
print(count)`,
        solution: `from collections import deque

n, m = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]
count = 0
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
for i in range(n):
    for j in range(m):
        if grid[i][j] != "1":
            continue
        count += 1
        queue = deque([(i, j)])
        grid[i][j] = "0"
        while queue:
            x, y = queue.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == "1":
                    grid[nx][ny] = "0"
                    queue.append((nx, ny))
print(count)`,
      },
    },
    idea:
      '扫描网格，遇到未访问的陆地就把答案加一，并用 BFS/DFS 把整座岛屿的 1 全部标记为已访问。每个格子最多处理一次，复杂度 O(nm)。',
    pitfalls: ['只检查右/下方向，导致漏掉部分连通块。', '入队后没有标记，重复访问。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-graph',
    id: 'algo-graph-02',
    slug: 'maze-shortest-path',
    title: '迷宫最短步数',
    order: 8,
    difficulty: 'hard',
    scenario: 'game',
    scenarioLabel: '游戏',
    knowledgePoints: ['algo-graph', 'algo-complexity'],
    prerequisites: ['algo-graph-01'],
    estimatedMinutes: 25,
    summary: '在网格迷宫中用 BFS 求起点到终点的最短步数。',
    statement: {
      scenarioText:
        '游戏角色从地图的 S 出发，要走到 E。地图中 # 是墙，. 是空地，每步可以上下左右移动一格。',
      task: '求从 S 到 E 的最短步数；无法到达输出 -1。',
      input: '第一行 n 和 m。接下来 n 行，每行一个长度为 m 的地图字符串。',
      output: '一行一个整数。',
      constraints: '1 ≤ n, m ≤ 1000，地图有且仅有一个 S 和一个 E。',
    },
    samples: [
      {
        input: '3 3\nS..\n.#.\n..E\n',
        output: '4\n',
        explanation: 'S→(0,1)→(0,2)→(1,2)→E。',
      },
      { input: '1 2\nSE\n', output: '1\n' },
    ],
    tests: [
      { input: '3 3\nS#.\n.#.\n..E\n', output: '4\n' },
      { input: '2 2\nS#\n#E\n', output: '-1\n' },
      { input: '3 3\nS..\n###\n..E\n', output: '-1\n' },
    ],
    hints: ['BFS 第一次到达终点就是最短。', '队列里同时保存坐标和步数。', '入队前标记 visited。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> grid(n);
    for (auto& row : grid) cin >> row;
    // TODO: BFS 求最短路
    cout << -1 << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<string> grid(n);
    for (auto& row : grid) cin >> row;
    pair<int,int> start;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < m; ++j)
            if (grid[i][j] == 'S') start = {i, j};
    int dx[4] = {-1, 1, 0, 0};
    int dy[4] = {0, 0, -1, 1};
    queue<tuple<int,int,int>> q;
    q.push({start.first, start.second, 0});
    grid[start.first][start.second] = '#';
    while (!q.empty()) {
        auto state = q.front();
        q.pop();
        int x = get<0>(state), y = get<1>(state), dist = get<2>(state);
        if (grid[x][y] == 'E') {
            cout << dist << '\n';
            return 0;
        }
        for (int d = 0; d < 4; ++d) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
            if (grid[nx][ny] == '#') continue;
            char cell = grid[nx][ny];
            grid[nx][ny] = '#';
            q.push({nx, ny, dist + 1});
            if (cell == 'E') {
                cout << dist + 1 << '\n';
                return 0;
            }
        }
    }
    cout << -1 << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `from collections import deque

n, m = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]
# TODO: BFS 求最短路
print(-1)`,
        solution: `from collections import deque

n, m = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]
start = None
for i in range(n):
    for j in range(m):
        if grid[i][j] == "S":
            start = (i, j)
queue = deque([(start[0], start[1], 0)])
grid[start[0]][start[1]] = "#"
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
while queue:
    x, y, dist = queue.popleft()
    if grid[x][y] == "E":
        print(dist)
        break
    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if not (0 <= nx < n and 0 <= ny < m):
            continue
        if grid[nx][ny] == "#":
            continue
        cell = grid[nx][ny]
        grid[nx][ny] = "#"
        if cell == "E":
            print(dist + 1)
            raise SystemExit
        queue.append((nx, ny, dist + 1))
else:
    print(-1)`,
      },
    },
    idea:
      '把每个格子看成无权图节点，上下左右是边。BFS 按层扩展，第一次到达 E 的步数就是最短步数。入队时立即标记，避免重复。',
    pitfalls: ['BFS 没有按层记录步数。', '终点被覆盖成墙后才判断，导致找不到。', '队列为空仍未输出 -1。'],
  },
];

export async function seedAdvancedProblems() {
  for (const problem of problems) {
    await writeProblem(problem);
  }
  console.log(`advanced problems generated: ${problems.length}`);
}
