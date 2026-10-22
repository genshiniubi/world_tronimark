import { writeProblem } from './helpers.mjs';

const raw = String.raw;

const problems = [
  {
    track: 'algorithms',
    moduleId: 'algo-binary',
    id: 'algo-binary-01',
    slug: 'binary-search-index',
    title: '有序数组查找',
    order: 1,
    difficulty: 'medium',
    scenario: 'algorithm',
    scenarioLabel: '算法竞赛',
    knowledgePoints: ['algo-binary', 'algo-complexity'],
    prerequisites: [],
    estimatedMinutes: 15,
    summary: '在非降序数组中查找目标值的最左下标。',
    statement: {
      scenarioText:
        '一个成绩系统保存了按分数从低到高排列的记录。现在要快速找到某个分数第一次出现的位置。',
      task: '对每个查询，输出目标值在数组中的最左下标；不存在输出 -1。下标从 0 开始。',
      input: '第一行 n 和 q。第二行 n 个非降序整数。第三行 q 个查询值。',
      output: '每个查询输出一行，表示最左下标或 -1。',
      constraints: '1 ≤ n, q ≤ 200000，-10^9 ≤ 数值 ≤ 10^9。',
    },
    samples: [
      {
        input: '5 3\n1 3 5 7 9\n5 1 8\n',
        output: '2\n0\n-1\n',
        explanation: '5 在下标 2；1 在下标 0；8 不存在。',
      },
    ],
    tests: [
      { input: '1 1\n42\n42\n', output: '0\n' },
      { input: '6 4\n-5 -1 0 0 3 8\n-1 0 8 100\n', output: '1\n2\n5\n-1\n' },
      { input: '4 2\n1 2 3 4\n4 0\n', output: '3\n-1\n' },
    ],
    hints: ['用 left/right 双指针。', '找到相等元素后继续向左收缩，才能得到最左下标。', 'mid 写成 left + (right - left) / 2。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (long long& x : a) cin >> x;
    while (q--) {
        long long target;
        cin >> target;
        int left = 0, right = n - 1, answer = -1;
        // TODO: 二分查找最左下标
        cout << answer << '\n';
    }
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (long long& x : a) cin >> x;
    while (q--) {
        long long target;
        cin >> target;
        int left = 0, right = n - 1, answer = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (a[mid] >= target) {
                if (a[mid] == target) answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        cout << answer << '\n';
    }
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `n, q = map(int, input().split())
a = list(map(int, input().split()))
queries = list(map(int, input().split()))

for target in queries:
    left, right = 0, n - 1
    answer = -1
    # TODO: 二分查找最左下标
    print(answer)`,
        solution: `n, q = map(int, input().split())
a = list(map(int, input().split()))
queries = list(map(int, input().split()))

for target in queries:
    left, right = 0, n - 1
    answer = -1
    while left <= right:
        mid = left + (right - left) // 2
        if a[mid] >= target:
            if a[mid] == target:
                answer = mid
            right = mid - 1
        else:
            left = mid + 1
    print(answer)`,
      },
    },
    idea:
      '标准二分找到相等元素后不立即返回，而是继续把 right 收缩到 mid-1，记录最后一次相等的位置，从而得到最左下标。',
    pitfalls: ['找到就返回，无法保证最左。', 'mid 使用 (left+right)/2 在大范围下溢出。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-binary',
    id: 'algo-binary-02',
    slug: 'wood-cut',
    title: '木材切割',
    order: 2,
    difficulty: 'hard',
    scenario: 'logistics',
    scenarioLabel: '物流调度',
    knowledgePoints: ['algo-binary', 'algo-complexity'],
    prerequisites: ['algo-binary-01'],
    estimatedMinutes: 25,
    summary: '二分答案：求能切出至少 k 段等长木材的最大长度。',
    statement: {
      scenarioText:
        '家具厂有一批原木，需要切成至少 k 段长度相同的木材。为了减少浪费，希望每段尽可能长。',
      task: '求最大的整数长度 L，使得所有原木能切出至少 k 段长度为 L 的木材。',
      input: '第一行 n 和 k。第二行 n 个整数，表示每根原木长度。',
      output: '一行一个整数，表示最大长度 L。',
      constraints: '1 ≤ n ≤ 200000，1 ≤ k ≤ 10^9，1 ≤ 长度 ≤ 10^9。保证至少能切出 k 段长度为 1 的木材。',
    },
    samples: [
      {
        input: '4 7\n5 9 12 8\n',
        output: '4\n',
        explanation: 'L=4 时可切 1+2+3+2=8 段；L=5 时只有 5 段。',
      },
    ],
    tests: [
      { input: '3 5\n4 4 4\n', output: '2\n' },
      { input: '1 1\n10\n', output: '10\n' },
      { input: '5 3\n6 6 6 6 6\n', output: '6\n' },
      { input: '4 11\n10 10 10 10\n', output: '3\n' },
    ],
    hints: ['答案 L 越大，能切出的段数越少，具有单调性。', '二分 L，check(L) 统计 sum(length / L)。', 'L 的范围是 [1, maxLength]。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> lengths(n);
    for (long long& x : lengths) cin >> x;
    long long left = 1, right = *max_element(lengths.begin(), lengths.end());
    long long answer = 0;
    // TODO: 二分答案
    cout << answer << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> lengths(n);
    for (long long& x : lengths) cin >> x;
    long long left = 1, right = *max_element(lengths.begin(), lengths.end());
    long long answer = 0;
    while (left <= right) {
        long long mid = left + (right - left) / 2;
        long long pieces = 0;
        for (long long length : lengths) pieces += length / mid;
        if (pieces >= k) {
            answer = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << answer << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `n, k = map(int, input().split())
lengths = list(map(int, input().split()))

left, right = 1, max(lengths)
answer = 0
# TODO: 二分答案
print(answer)`,
        solution: `n, k = map(int, input().split())
lengths = list(map(int, input().split()))

left, right = 1, max(lengths)
answer = 0
while left <= right:
    mid = left + (right - left) // 2
    pieces = sum(length // mid for length in lengths)
    if pieces >= k:
        answer = mid
        left = mid + 1
    else:
        right = mid - 1
print(answer)`,
      },
    },
    idea:
      '二分长度 L。L 越大，能切出的段数越少，因此“段数 ≥ k”具有单调性。每次 check 线性统计段数，总复杂度 O(n log maxLength)。',
    pitfalls: ['check 里除以 0。', '段数用 int 溢出。', '二分方向写反。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-dp',
    id: 'algo-dp-01',
    slug: 'climb-stairs',
    title: '爬楼梯',
    order: 3,
    difficulty: 'medium',
    scenario: 'algorithm',
    scenarioLabel: '算法竞赛',
    knowledgePoints: ['algo-dp', 'algo-complexity'],
    prerequisites: ['algo-binary-02'],
    estimatedMinutes: 15,
    summary: '每次走 1 或 2 级，求到达第 n 级的方案数。',
    statement: {
      scenarioText:
        '一段楼梯有 n 级。你每次可以走 1 级或 2 级，想知道从地面走到第 n 级共有多少种走法。',
      task: '输出走法数量对 1,000,000,007 取模的结果。',
      input: '一行一个整数 n。',
      output: '一行一个整数，表示方案数。',
      constraints: '1 ≤ n ≤ 10^6。',
    },
    samples: [
      { input: '3\n', output: '3\n', explanation: '1+1+1、1+2、2+1。' },
      { input: '10\n', output: '89\n' },
    ],
    tests: [
      { input: '1\n', output: '1\n' },
      { input: '2\n', output: '2\n' },
      { input: '5\n', output: '8\n' },
      { input: '50\n', output: '365010934\n' },
    ],
    hints: ['dp[i] 表示到第 i 级的方案数。', 'dp[i] = dp[i-1] + dp[i-2]。', 'dp[0]=1，dp[1]=1。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    const long long MOD = 1000000007;
    vector<long long> dp(n + 1);
    // TODO: 初始化并转移
    cout << dp[n] << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    const long long MOD = 1000000007;
    vector<long long> dp(n + 1);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; ++i) {
        dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
    }
    cout << dp[n] << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `n = int(input())
MOD = 1000000007
dp = [0] * (n + 1)
# TODO: 初始化并转移
print(dp[n])`,
        solution: `n = int(input())
MOD = 1000000007
dp = [0] * (n + 1)
dp[0] = 1
if n >= 1:
    dp[1] = 1
for i in range(2, n + 1):
    dp[i] = (dp[i - 1] + dp[i - 2]) % MOD
print(dp[n])`,
      },
    },
    idea:
      '定义 dp[i] 为到达第 i 级的方案数。最后一步可能走 1 级或 2 级，因此 dp[i] = dp[i-1] + dp[i-2]。初始化 dp[0]=1、dp[1]=1。',
    pitfalls: ['dp[0] 初始化为 0 导致结果偏小。', '忘记取模。', 'n=1 时访问 dp[2] 越界。'],
  },
  {
    track: 'algorithms',
    moduleId: 'algo-dp',
    id: 'algo-dp-02',
    slug: 'knapsack-01',
    title: '0/1 背包',
    order: 4,
    difficulty: 'hard',
    scenario: 'game',
    scenarioLabel: '游戏',
    knowledgePoints: ['algo-dp', 'algo-complexity'],
    prerequisites: ['algo-dp-01'],
    estimatedMinutes: 25,
    summary: '在容量限制下选择物品，使总价值最大。',
    statement: {
      scenarioText:
        '游戏角色的背包有容量限制。地上有若干物品，每件只能拿一次，每件有重量和价值。请选择一些物品，让总价值最大。',
      task: '输出不超过背包容量的最大总价值。',
      input: '第一行 n 和 capacity。接下来 n 行，每行 weight 和 value。',
      output: '一行一个整数，表示最大总价值。',
      constraints: '1 ≤ n ≤ 2000，1 ≤ capacity ≤ 10000，1 ≤ weight, value ≤ 10000。',
    },
    samples: [
      {
        input: '3 5\n2 3\n3 4\n4 5\n',
        output: '7\n',
        explanation: '选择重量 2 和 3 的物品，总价值 7。',
      },
    ],
    tests: [
      { input: '1 10\n10 100\n', output: '100\n' },
      { input: '4 5\n1 2\n2 4\n3 4\n4 5\n', output: '8\n' },
      { input: '3 3\n2 5\n2 6\n3 10\n', output: '10\n' },
    ],
    hints: ['dp[c] 表示容量 c 时的最大价值。', '0/1 背包压缩空间时容量倒序。', '不选和选当前物品取较大值。'],
    languages: {
      cpp: {
        entry: 'src/main.cpp',
        starter: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, capacity;
    cin >> n >> capacity;
    vector<long long> dp(capacity + 1, 0);
    for (int i = 0; i < n; ++i) {
        int weight, value;
        cin >> weight >> value;
        // TODO: 0/1 背包转移
    }
    cout << dp[capacity] << '\n';
    return 0;
}`,
        solution: raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, capacity;
    cin >> n >> capacity;
    vector<long long> dp(capacity + 1, 0);
    for (int i = 0; i < n; ++i) {
        int weight, value;
        cin >> weight >> value;
        for (int c = capacity; c >= weight; --c) {
            dp[c] = max(dp[c], dp[c - weight] + value);
        }
    }
    cout << dp[capacity] << '\n';
    return 0;
}`,
      },
      python: {
        entry: 'src/main.py',
        starter: `n, capacity = map(int, input().split())
dp = [0] * (capacity + 1)
for _ in range(n):
    weight, value = map(int, input().split())
    # TODO: 0/1 背包转移
print(dp[capacity])`,
        solution: `n, capacity = map(int, input().split())
dp = [0] * (capacity + 1)
for _ in range(n):
    weight, value = map(int, input().split())
    for c in range(capacity, weight - 1, -1):
        dp[c] = max(dp[c], dp[c - weight] + value)
print(dp[capacity])`,
      },
    },
    idea:
      'dp[c] 表示容量 c 下能获得的最大价值。每件物品只能选一次，因此容量必须从大到小更新，避免同一件物品被重复使用。',
    pitfalls: ['容量正序遍历，变成完全背包。', 'weight > capacity 时数组越界。', '价值用 int 溢出（本题范围内 long long 更稳）。'],
  },
];

export async function seedAlgorithmProblems() {
  for (const problem of problems) {
    await writeProblem(problem);
  }
  console.log(`algorithm problems generated: ${problems.length}`);
}
