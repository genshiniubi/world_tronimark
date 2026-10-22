import { writeProblem } from './helpers.mjs';

const cpp = (starter, solution, entry = 'src/main.cpp') => ({ starter, solution, entry });
const raw = String.raw;

const problems = [
  {
    track: 'cpp',
    moduleId: 'cpp-start',
    id: 'cpp-start-01',
    slug: 'milk-tea-receipt',
    title: '奶茶店订单小票',
    order: 1,
    difficulty: 'beginner',
    scenario: 'retail',
    scenarioLabel: '商业零售',
    knowledgePoints: ['cpp-io', 'cpp-variables', 'cpp-arithmetic'],
    prerequisites: [],
    estimatedMinutes: 10,
    summary: '读入单价、数量和折扣，输出保留两位小数的实付金额。',
    statement: {
      scenarioText:
        '学校门口的奶茶店正在升级收银系统。店员输入单价、杯数和折扣百分比，系统需要打印一张金额正确、保留两位小数的订单小票。',
      task: '计算订单原价、折扣金额和实付金额。折扣按原价的百分比计算。',
      input: '一行三个整数：单价 price、数量 count、折扣百分比 discount（0 ≤ discount ≤ 100）。',
      output: '一行一个实数，表示实付金额，保留两位小数。',
      constraints: '1 ≤ price ≤ 10000，1 ≤ count ≤ 1000，0 ≤ discount ≤ 100。',
      note: '建议使用 double 保存金额，并用 fixed 与 setprecision(2) 控制输出。',
    },
    samples: [
      {
        input: '12 3 10\n',
        output: '32.40\n',
        explanation: '原价 36 元，折扣 3.6 元，实付 32.4 元。',
      },
      { input: '5 4 0\n', output: '20.00\n' },
    ],
    tests: [
      { input: '99 2 25\n', output: '148.50\n' },
      { input: '1 1 100\n', output: '0.00\n' },
      { input: '19 7 15\n', output: '113.05\n' },
    ],
    hints: [
      '原价 = 单价 × 数量。',
      '折扣金额 = 原价 × 折扣百分比 ÷ 100。',
      '输出前用 cout << fixed << setprecision(2)。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int price, count, discount;
    cin >> price >> count >> discount;

    // TODO: 计算原价、折扣金额与实付金额
    double subtotal = 0;
    double total = 0;

    cout << fixed << setprecision(2) << total << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int price, count, discount;
    cin >> price >> count >> discount;
    double subtotal = price * count;
    double total = subtotal * (100 - discount) / 100.0;
    cout << fixed << setprecision(2) << total << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '先把单价和数量相乘得到原价，再按百分比计算折扣。实付金额 = 原价 × (100 - discount) / 100。使用 double 避免整数除法丢失小数，输出时固定两位小数。',
    pitfalls: ['忘记使用 double，导致折扣被整数除法截断。', '没有设置 fixed 和 setprecision。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-start',
    id: 'cpp-start-02',
    slug: 'vending-change',
    title: '自动售货机的找零',
    order: 2,
    difficulty: 'beginner',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['cpp-io', 'cpp-variables', 'cpp-arithmetic'],
    prerequisites: ['cpp-start-01'],
    estimatedMinutes: 12,
    summary: '计算找零，并拆成 10 元、5 元、1 元纸币/硬币的数量。',
    statement: {
      scenarioText:
        '一台老式自动售货机只支持 10 元、5 元和 1 元三种零钱。顾客投入纸币后，机器需要找零并给出每种面额的数量。',
      task: '给定顾客支付金额和商品价格，计算找零，并输出 10 元、5 元、1 元的数量。如果支付不足，输出 ERROR。',
      input: '一行两个整数：paid 和 price。',
      output:
        '如果 paid < price，输出 ERROR；否则输出四个整数：找零总额、10 元张数、5 元张数、1 元张数。',
      constraints: '0 ≤ paid, price ≤ 100000。',
    },
    samples: [
      {
        input: '20 13\n',
        output: '7 0 1 2\n',
        explanation: '找零 7 元，用 1 张 5 元和 2 枚 1 元。',
      },
      { input: '5 8\n', output: 'ERROR\n' },
    ],
    tests: [
      { input: '10 10\n', output: '0 0 0 0\n' },
      { input: '100 37\n', output: '63 6 0 3\n' },
      { input: '50 49\n', output: '1 0 0 1\n' },
    ],
    hints: [
      '先判断支付是否足够。',
      '10 元张数 = change / 10，然后 change %= 10。',
      '按 10、5、1 的顺序依次拆分。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int paid, price;
    cin >> paid >> price;
    if (paid < price) {
        cout << "ERROR\n";
        return 0;
    }
    int change = paid - price;
    // TODO: 计算三种面额的数量
    int tens = 0, fives = 0, ones = 0;
    cout << change << ' ' << tens << ' ' << fives << ' ' << ones << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int paid, price;
    cin >> paid >> price;
    if (paid < price) {
        cout << "ERROR\n";
        return 0;
    }
    int change = paid - price;
    int tens = change / 10;
    change %= 10;
    int fives = change / 5;
    change %= 5;
    cout << (paid - price) << ' ' << tens << ' ' << fives << ' ' << change << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '先判断支付是否足够，然后按面额从大到小贪心拆分。先取 10 元，余数再取 5 元，最后剩下的都是 1 元。',
    pitfalls: ['输出时把已经改变的 change 当成总额。', '忘记处理支付不足。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-control',
    id: 'cpp-control-01',
    slug: 'subway-fare',
    title: '地铁票价规则',
    order: 3,
    difficulty: 'beginner',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['cpp-conditions'],
    prerequisites: ['cpp-start-02'],
    estimatedMinutes: 8,
    summary: '按里程区间计算地铁票价，练习多分支条件。',
    statement: {
      scenarioText:
        '城市地铁按里程分段计价。运营方希望用一个简单程序验证票价规则是否正确。',
      task: '根据乘车里程计算票价。',
      input: '一行一个整数 distance，表示乘车里程（公里）。',
      output: '一行一个整数，表示票价。',
      constraints:
        '0 ≤ distance ≤ 1000。票价规则：里程 ≤ 6 收 3 元；6 < 里程 ≤ 12 收 4 元；12 < 里程 ≤ 22 收 5 元；里程 > 22 收 6 元。',
    },
    samples: [
      { input: '6\n', output: '3\n', explanation: '6 公里以内（含 6）票价 3 元。' },
      { input: '13\n', output: '5\n' },
    ],
    tests: [
      { input: '0\n', output: '3\n' },
      { input: '7\n', output: '4\n' },
      { input: '12\n', output: '4\n' },
      { input: '22\n', output: '5\n' },
      { input: '23\n', output: '6\n' },
      { input: '1000\n', output: '6\n' },
    ],
    hints: ['按里程从小到大判断。', '注意每个区间的右端点是否包含。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int distance;
    cin >> distance;
    int fare = 0;
    // TODO: 根据里程区间设置 fare
    cout << fare << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int distance;
    cin >> distance;
    int fare;
    if (distance <= 6) fare = 3;
    else if (distance <= 12) fare = 4;
    else if (distance <= 22) fare = 5;
    else fare = 6;
    cout << fare << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '把规则按里程从小到大写成 if / else if 链。每个分支只需要判断当前区间的上界，因为前面的条件已经把更小的里程排除掉了。',
    pitfalls: ['把 6 和 12 这样的边界分到错误区间。', '所有分支都没有覆盖时 fare 仍是默认值。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-control',
    id: 'cpp-control-02',
    slug: 'inventory-loop',
    title: '仓库库存盘点',
    order: 4,
    difficulty: 'easy',
    scenario: 'retail',
    scenarioLabel: '商业零售',
    knowledgePoints: ['cpp-loops'],
    prerequisites: ['cpp-control-01'],
    estimatedMinutes: 15,
    summary: '读入一组库存数，统计总和、最大值、最小值与零库存数量。',
    statement: {
      scenarioText:
        '仓库管理员每天要盘点若干货架的库存。请写一个程序，快速汇总这批数据。',
      task: '输出库存总和、最大值、最小值和库存为 0 的货架数量。',
      input: '第一行一个整数 n。第二行 n 个整数，表示每个货架的库存。',
      output: '一行四个整数：sum max min zeroCount。',
      constraints: '1 ≤ n ≤ 100000，-1000000 ≤ 库存 ≤ 1000000。',
    },
    samples: [
      {
        input: '5\n3 -1 0 8 2\n',
        output: '12 8 -1 1\n',
        explanation: '总和 12，最大值 8，最小值 -1，1 个零库存。',
      },
      { input: '1\n-5\n', output: '-5 -5 -5 0\n' },
    ],
    tests: [
      { input: '4\n0 0 0 0\n', output: '0 0 0 4\n' },
      { input: '6\n10 2 30 4 5 6\n', output: '57 30 2 0\n' },
      { input: '3\n-7 -2 -9\n', output: '-18 -2 -9 0\n' },
    ],
    hints: [
      '先把 max 和 min 初始化为第一个库存值。',
      '循环从第二个元素开始，或者统一在循环里更新。',
      '总和可能超过 int，建议用 long long。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = 0, minimum = 0, zeroCount = 0;
    // TODO: 读入 n 个数并统计
    cout << sum << ' ' << maximum << ' ' << minimum << ' ' << zeroCount << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = INT_MIN, minimum = INT_MAX, zeroCount = 0;
    for (int i = 0; i < n; ++i) {
        int value;
        cin >> value;
        sum += value;
        maximum = max(maximum, value);
        minimum = min(minimum, value);
        if (value == 0) ++zeroCount;
    }
    cout << sum << ' ' << maximum << ' ' << minimum << ' ' << zeroCount << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '一次遍历完成全部统计。总和用 long long，最大值/最小值初始化为整数极值，遇到每个元素时更新四个统计量。',
    pitfalls: ['最大值初始化为 0，遇到全负数会出错。', '总和用 int 可能溢出。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-functions',
    id: 'cpp-functions-01',
    slug: 'delivery-fee',
    title: '快递运费计算器',
    order: 5,
    difficulty: 'easy',
    scenario: 'logistics',
    scenarioLabel: '物流调度',
    knowledgePoints: ['cpp-functions'],
    prerequisites: ['cpp-control-02'],
    estimatedMinutes: 12,
    summary: '把运费规则封装成函数，处理重量和加急选项。',
    statement: {
      scenarioText:
        '快递站需要给顾客快速报价。首重 1 公斤 10 元，超过 1 公斤的部分每公斤加 5 元；加急另收 8 元。',
      task: '实现运费计算函数，并输出总运费。',
      input: '一行：重量 weight（正整数）和加急标记 express（Y 或 N）。',
      output: '一行一个整数，表示总运费。',
      constraints: '1 ≤ weight ≤ 1000。',
    },
    samples: [
      { input: '1 N\n', output: '10\n', explanation: '首重 1 公斤 10 元，不加急。' },
      { input: '3 Y\n', output: '28\n', explanation: '10 + 2×5 + 8 = 28。' },
    ],
    tests: [
      { input: '10 N\n', output: '55\n' },
      { input: '2 Y\n', output: '23\n' },
      { input: '1 Y\n', output: '18\n' },
      { input: '1000 N\n', output: '5005\n' },
    ],
    hints: [
      '超过 1 公斤的部分是 weight - 1。',
      '先算基础运费，再加急。',
      '把计算写成 int deliveryFee(int weight, bool express)。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int deliveryFee(int weight, bool express) {
    // TODO: 实现运费规则
    return 0;
}

int main() {
    int weight;
    char express;
    cin >> weight >> express;
    cout << deliveryFee(weight, express == 'Y') << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int deliveryFee(int weight, bool express) {
    int fee = 10 + (weight - 1) * 5;
    if (express) fee += 8;
    return fee;
}

int main() {
    int weight;
    char express;
    cin >> weight >> express;
    cout << deliveryFee(weight, express == 'Y') << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '把规则写进函数：首重 10 元，超出部分每公斤 5 元，加急再加 8 元。main 只负责读入和调用，便于单独测试函数。',
    pitfalls: ['把 weight 当成超出部分，导致多算一公斤。', '把 Y/N 当成字符串读入。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-functions',
    id: 'cpp-functions-02',
    slug: 'gcd-lcm',
    title: '最大公约数与最小公倍数',
    order: 6,
    difficulty: 'medium',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['cpp-functions', 'cpp-recursion'],
    prerequisites: ['cpp-functions-01'],
    estimatedMinutes: 15,
    summary: '用递归实现欧几里得算法，并计算最小公倍数。',
    statement: {
      scenarioText:
        '在安排实验批次时，需要把两种周期不同的设备对齐。两个周期的最小公倍数决定了下一次同时启动的时间。',
      task: '计算两个正整数的最大公约数 gcd 和最小公倍数 lcm。',
      input: '一行两个正整数 a 和 b。',
      output: '一行两个整数：gcd 和 lcm。',
      constraints: '1 ≤ a, b ≤ 1,000,000。',
    },
    samples: [
      { input: '12 18\n', output: '6 36\n', explanation: 'gcd(12,18)=6，lcm=12×18/6=36。' },
      { input: '7 13\n', output: '1 91\n' },
    ],
    tests: [
      { input: '100 75\n', output: '25 300\n' },
      { input: '1 1\n', output: '1 1\n' },
      { input: '1000000 999999\n', output: '1 999999000000\n' },
    ],
    hints: [
      '欧几里得算法：gcd(a,b) = gcd(b, a % b)，b 为 0 时返回 a。',
      'lcm = a / gcd(a,b) * b，先除后乘可以减小溢出风险。',
      '使用 long long。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

long long gcd(long long a, long long b) {
    // TODO: 递归或循环实现
    return 1;
}

int main() {
    long long a, b;
    cin >> a >> b;
    long long g = gcd(a, b);
    cout << g << ' ' << (a / g) * b << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

int main() {
    long long a, b;
    cin >> a >> b;
    long long g = gcd(a, b);
    cout << g << ' ' << (a / g) * b << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '欧几里得算法利用 gcd(a,b)=gcd(b,a%b)，递归到 b=0 时返回 a。最小公倍数等于 a/gcd(a,b)×b，先除后乘避免中间结果溢出。',
    pitfalls: ['递归没有出口。', '先乘后除导致 long long 溢出。', '使用 int 存储 lcm。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-data',
    id: 'cpp-data-01',
    slug: 'score-analysis',
    title: '成绩分析',
    order: 7,
    difficulty: 'easy',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['cpp-arrays', 'cpp-loops'],
    prerequisites: ['cpp-control-02'],
    estimatedMinutes: 15,
    summary: '批量读取成绩，计算平均分、最高分、最低分和及格人数。',
    statement: {
      scenarioText:
        '老师想把一次随堂测验的成绩录入系统，快速得到班级的整体情况。',
      task: '计算平均分、最高分、最低分和及格人数（≥60 分）。',
      input: '第一行 n，第二行 n 个整数成绩。',
      output: '一行：平均分（保留两位小数）、最高分、最低分、及格人数。',
      constraints: '1 ≤ n ≤ 100000，0 ≤ 成绩 ≤ 100。',
    },
    samples: [
      {
        input: '5\n90 80 70 60 50\n',
        output: '70.00 90 50 4\n',
        explanation: '总分 350，平均 70；及格 4 人。',
      },
      { input: '3\n59 58 57\n', output: '58.00 59 57 0\n' },
    ],
    tests: [
      { input: '1\n100\n', output: '100.00 100 100 1\n' },
      { input: '4\n0 100 100 0\n', output: '50.00 100 0 2\n' },
      { input: '6\n60 61 62 63 64 65\n', output: '62.50 65 60 6\n' },
    ],
    hints: [
      '边读入边累加，不需要保存整个数组。',
      '平均分 = 总分 / n，注意转成 double。',
      '及格人数在循环里判断。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = 0, minimum = 100, passCount = 0;
    // TODO: 读入成绩并统计
    cout << fixed << setprecision(2) << (double)sum / n << ' '
         << maximum << ' ' << minimum << ' ' << passCount << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    int maximum = INT_MIN, minimum = INT_MAX, passCount = 0;
    for (int i = 0; i < n; ++i) {
        int score;
        cin >> score;
        sum += score;
        maximum = max(maximum, score);
        minimum = min(minimum, score);
        if (score >= 60) ++passCount;
    }
    cout << fixed << setprecision(2) << (double)sum / n << ' '
         << maximum << ' ' << minimum << ' ' << passCount << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '一次遍历即可完成总和、最值和及格人数统计。平均分在输出时再除，避免每一步都做浮点运算。',
    pitfalls: ['平均分用整数除法。', '及格人数条件写成 >60。', '最值初始化不适合数据范围。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-data',
    id: 'cpp-data-02',
    slug: 'palindrome-name',
    title: '回文昵称',
    order: 8,
    difficulty: 'easy',
    scenario: 'text',
    scenarioLabel: '文本处理',
    knowledgePoints: ['cpp-strings'],
    prerequisites: ['cpp-data-01'],
    estimatedMinutes: 10,
    summary: '忽略大小写判断一个字符串是否回文。',
    statement: {
      scenarioText:
        '社区活动要给回文昵称的用户发小礼物。运营同学需要快速判断昵称正着读和反着读是否一样。',
      task: '忽略字母大小写，判断昵称是否为回文。',
      input: '一行一个不含空格的字符串 s。',
      output: '是回文输出 YES，否则输出 NO。',
      constraints: '1 ≤ |s| ≤ 100000，s 只包含英文字母和数字。',
    },
    samples: [
      { input: 'Level\n', output: 'YES\n', explanation: '忽略大小写后 level 是回文。' },
      { input: 'hello\n', output: 'NO\n' },
    ],
    tests: [
      { input: 'A\n', output: 'YES\n' },
      { input: 'AbBa\n', output: 'YES\n' },
      { input: 'abcda\n', output: 'NO\n' },
      { input: '12321\n', output: 'YES\n' },
    ],
    hints: [
      '用两个下标从两端向中间比较。',
      '可以先用 tolower 统一大小写。',
      '遇到不一致立即输出 NO。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    for (char& ch : s) ch = tolower(ch);
    // TODO: 判断 s 是否为回文
    bool ok = true;
    cout << (ok ? "YES" : "NO") << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    for (char& ch : s) ch = tolower(ch);
    bool ok = true;
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            ok = false;
            break;
        }
        ++left;
        --right;
    }
    cout << (ok ? "YES" : "NO") << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '先统一转成小写，再用双指针从两端向中间比较。只要有一对字符不相等，就不是回文。时间复杂度 O(n)，额外空间 O(1)。',
    pitfalls: ['忘记大小写统一。', '循环条件写成 left <= right，导致中间字符被误判。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-memory',
    id: 'cpp-memory-01',
    slug: 'swap-array-ends',
    title: '交换首尾元素',
    order: 9,
    difficulty: 'medium',
    scenario: 'game',
    scenarioLabel: '游戏',
    knowledgePoints: ['cpp-references', 'cpp-arrays'],
    prerequisites: ['cpp-data-02'],
    estimatedMinutes: 12,
    summary: '用引用参数原地交换数组首尾元素。',
    statement: {
      scenarioText:
        '一个卡牌小游戏每回合会把牌堆首尾两张牌交换位置。请实现这个原地操作。',
      task: '实现函数 swapEnds，将数组第一个和最后一个元素交换。数组只有 1 个元素时不变。',
      input: '第一行 n，第二行 n 个整数。',
      output: '交换后的一行 n 个整数，用空格分隔。',
      constraints: '1 ≤ n ≤ 100000。',
    },
    samples: [
      { input: '5\n1 2 3 4 5\n', output: '5 2 3 4 1\n', explanation: '首尾 1 和 5 交换。' },
      { input: '1\n9\n', output: '9\n' },
    ],
    tests: [
      { input: '2\n1 2\n', output: '2 1\n' },
      { input: '6\n-1 2 3 4 5 6\n', output: '6 2 3 4 5 -1\n' },
      { input: '4\n7 7 7 7\n', output: '7 7 7 7\n' },
    ],
    hints: ['参数写成 vector<int>& a。', '用 swap(a.front(), a.back())。', 'n=1 时首尾是同一个元素，交换也安全。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

void swapEnds(vector<int>& a) {
    // TODO: 交换首尾
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;
    swapEnds(a);
    for (int i = 0; i < n; ++i) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

void swapEnds(vector<int>& a) {
    if (a.size() >= 2) swap(a.front(), a.back());
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;
    swapEnds(a);
    for (int i = 0; i < n; ++i) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '引用参数让函数直接操作调用方的 vector，而不是复制一份。n≥2 时交换首尾，n=1 时保持不变。',
    pitfalls: ['参数按值传递，修改没有作用到原数组。', '空数组访问首尾元素。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-memory',
    id: 'cpp-memory-02',
    slug: 'contact-sort',
    title: '通讯录排序',
    order: 10,
    difficulty: 'medium',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['cpp-structs', 'cpp-sort'],
    prerequisites: ['cpp-memory-01'],
    estimatedMinutes: 18,
    summary: '用结构体保存联系人，按年龄和姓名排序。',
    statement: {
      scenarioText:
        '班级通讯录需要按年龄从小到大排序；年龄相同的同学按姓名字典序排列。',
      task: '读入联系人，按年龄升序、姓名升序输出。',
      input: '第一行 n。接下来 n 行，每行一个姓名（不含空格）和年龄。',
      output: '排序后的 n 行，每行姓名和年龄。',
      constraints: '1 ≤ n ≤ 100000，1 ≤ 年龄 ≤ 150。',
    },
    samples: [
      {
        input: '3\nAlice 20\nBob 18\nCarol 20\n',
        output: 'Bob 18\nAlice 20\nCarol 20\n',
        explanation: 'Bob 年龄最小；Alice 和 Carol 同岁，按姓名字典序。',
      },
      { input: '2\nz 30\na 30\n', output: 'a 30\nz 30\n' },
    ],
    tests: [
      { input: '1\nTom 25\n', output: 'Tom 25\n' },
      { input: '4\nB 19\nA 19\nD 18\nC 20\n', output: 'D 18\nA 19\nB 19\nC 20\n' },
      { input: '3\nAmy 20\nAmy 20\nBob 20\n', output: 'Amy 20\nAmy 20\nBob 20\n' },
    ],
    hints: [
      '定义 struct Person { string name; int age; }。',
      '比较器先比 age，再比 name。',
      '姓名相同、年龄相同也没关系，稳定排序不是必须的。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

struct Person {
    string name;
    int age;
};

int main() {
    int n;
    cin >> n;
    vector<Person> people(n);
    for (Person& p : people) cin >> p.name >> p.age;
    // TODO: 按 age 升序、name 升序排序
    for (const Person& p : people) cout << p.name << ' ' << p.age << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

struct Person {
    string name;
    int age;
};

int main() {
    int n;
    cin >> n;
    vector<Person> people(n);
    for (Person& p : people) cin >> p.name >> p.age;
    sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        if (a.age != b.age) return a.age < b.age;
        return a.name < b.name;
    });
    for (const Person& p : people) cout << p.name << ' ' << p.age << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '结构体把姓名和年龄组织成一个整体。排序比较器先比较年龄，年龄相同再比较姓名。比较器必须满足严格弱序。',
    pitfalls: ['比较器写成 <=，可能导致排序行为未定义。', '只按年龄排序，没有处理同岁情况。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-stl',
    id: 'cpp-stl-01',
    slug: 'word-frequency',
    title: '聊天词频统计',
    order: 11,
    difficulty: 'medium',
    scenario: 'text',
    scenarioLabel: '文本处理',
    knowledgePoints: ['cpp-stl', 'cpp-sort'],
    prerequisites: ['cpp-memory-02'],
    estimatedMinutes: 18,
    summary: '统计单词出现次数，按次数降序、单词字典序输出。',
    statement: {
      scenarioText:
        '运营同学想从群聊的高频词里找出大家都在讨论什么。请统计每个单词出现的次数。',
      task: '按出现次数从高到低排序；次数相同按单词字典序升序。',
      input: '第一行 n。第二行 n 个不含空格的单词。',
      output: '每行一个 `word count`。',
      constraints: '1 ≤ n ≤ 100000，单词只含小写英文字母，长度不超过 30。',
    },
    samples: [
      {
        input: '5\napple banana apple cherry banana\n',
        output: 'apple 2\nbanana 2\ncherry 1\n',
        explanation: 'apple 和 banana 都是 2 次，按字典序 apple 在前。',
      },
      { input: '1\nhello\n', output: 'hello 1\n' },
    ],
    tests: [
      { input: '3\nb a c\n', output: 'a 1\nb 1\nc 1\n' },
      { input: '6\nx y x y z z\n', output: 'x 2\ny 2\nz 2\n' },
      { input: '4\nsame same same other\n', output: 'same 3\nother 1\n' },
    ],
    hints: ['用 map<string,int> 统计。', '把键值对放进 vector 再排序。', '排序规则：次数降序，次数相同单词升序。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> counts;
    for (int i = 0; i < n; ++i) {
        string word;
        cin >> word;
        ++counts[word];
    }
    // TODO: 排序并输出
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> counts;
    for (int i = 0; i < n; ++i) {
        string word;
        cin >> word;
        ++counts[word];
    }
    vector<pair<string, int>> items(counts.begin(), counts.end());
    sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) return a.second > b.second;
        return a.first < b.first;
    });
    for (const auto& item : items) cout << item.first << ' ' << item.second << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '用 map 统计频率，再把 map 的键值对复制到 vector 中排序。排序规则先比较次数降序，次数相同再比较单词字典序。',
    pitfalls: ['只按次数排序，导致并列项顺序不稳定。', '直接对 map 排序，map 本身按 key 有序。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-stl',
    id: 'cpp-stl-02',
    slug: 'rider-dispatch',
    title: '外卖骑手调度',
    order: 12,
    difficulty: 'medium',
    scenario: 'logistics',
    scenarioLabel: '物流调度',
    knowledgePoints: ['cpp-stl', 'cpp-sort'],
    prerequisites: ['cpp-stl-01'],
    estimatedMinutes: 15,
    summary: '从一批配送时长中选择 k 个最短的，计算总耗时。',
    statement: {
      scenarioText:
        '调度中心有若干待配送订单，每个订单预计耗时不同。现在只能安排 k 个订单，希望总耗时尽可能小。',
      task: '选择 k 个预计耗时最短的订单，输出它们的耗时总和。',
      input: '第一行 n 和 k。第二行 n 个整数，表示每个订单的预计耗时。',
      output: '一行一个整数，表示最小的总耗时。',
      constraints: '1 ≤ k ≤ n ≤ 200000，1 ≤ 耗时 ≤ 1000000。',
    },
    samples: [
      {
        input: '5 3\n8 3 5 1 9\n',
        output: '9\n',
        explanation: '选择 1、3、5，总和 9。',
      },
      { input: '4 4\n4 3 2 1\n', output: '10\n' },
    ],
    tests: [
      { input: '6 2\n10 10 10 1 2 3\n', output: '3\n' },
      { input: '1 1\n7\n', output: '7\n' },
      { input: '5 3\n1000000 1000000 1000000 1000000 1000000\n', output: '3000000\n' },
    ],
    hints: ['可以用排序，也可以用大小为 k 的大根堆。', '堆里保留当前最小的 k 个。', '总和用 long long。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int> heap;
    // TODO: 维护最小的 k 个耗时
    long long sum = 0;
    cout << sum << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    priority_queue<int> heap;
    long long sum = 0;
    for (int i = 0; i < n; ++i) {
        int value;
        cin >> value;
        heap.push(value);
        sum += value;
        if ((int)heap.size() > k) {
            sum -= heap.top();
            heap.pop();
        }
    }
    cout << sum << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '维护一个大小为 k 的大根堆。每读入一个耗时就入堆并累加；堆超过 k 时，弹出最大值并从总和中减去。最后堆里就是最小的 k 个。',
    pitfalls: ['用升序排序后取前 k 个也可以，但没必要保存全部。', '总和用 int 可能溢出。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-oop',
    id: 'cpp-oop-01',
    slug: 'bank-account',
    title: '银行账户',
    order: 13,
    difficulty: 'medium',
    scenario: 'finance',
    scenarioLabel: '金融账单',
    knowledgePoints: ['cpp-oop'],
    prerequisites: ['cpp-functions-02'],
    estimatedMinutes: 20,
    summary: '用类封装账户余额，处理存款、取款和余额查询。',
    statement: {
      scenarioText:
        '一个简易银行系统需要处理账户操作。取款不能透支；每次操作都要给出明确结果。',
      task: '实现 Account 类，处理 n 条命令。',
      input:
        '第一行 n。接下来 n 行，每行是 `DEPOSIT x`、`WITHDRAW x` 或 `BALANCE`。初始余额为 0。',
      output:
        'DEPOSIT 和成功的 WITHDRAW 输出 `OK`；余额不足的 WITHDRAW 输出 `ERROR`；BALANCE 输出当前余额。',
      constraints: '1 ≤ n ≤ 100000，0 ≤ x ≤ 10^9。金额总和在 long long 范围内。',
    },
    samples: [
      {
        input: '6\nDEPOSIT 100\nWITHDRAW 30\nBALANCE\nWITHDRAW 100\nDEPOSIT 20\nBALANCE\n',
        output: 'OK\nOK\n70\nERROR\nOK\n90\n',
        explanation: '余额 100，取 30 得 70；再取 100 失败；存 20 得 90。',
      },
    ],
    tests: [
      { input: '3\nBALANCE\nDEPOSIT 5\nBALANCE\n', output: '0\nOK\n5\n' },
      { input: '2\nWITHDRAW 1\nDEPOSIT 10\n', output: 'ERROR\nOK\n' },
      { input: '4\nDEPOSIT 1000000000\nDEPOSIT 1000000000\nWITHDRAW 2000000000\nBALANCE\n', output: 'OK\nOK\nOK\n0\n' },
    ],
    hints: [
      '类里用 long long balance_ 保存余额。',
      'withdraw 返回 bool，成功才扣款。',
      '命令用 string 读入，金额用 long long。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

class Account {
public:
    void deposit(long long amount) {
        // TODO
    }

    bool withdraw(long long amount) {
        // TODO
        return false;
    }

    long long balance() const {
        // TODO
        return 0;
    }

private:
    long long balance_ = 0;
};

int main() {
    int n;
    cin >> n;
    Account account;
    while (n--) {
        string op;
        cin >> op;
        if (op == "DEPOSIT") {
            long long x;
            cin >> x;
            account.deposit(x);
            cout << "OK\n";
        } else if (op == "WITHDRAW") {
            long long x;
            cin >> x;
            cout << (account.withdraw(x) ? "OK" : "ERROR") << '\n';
        } else {
            cout << account.balance() << '\n';
        }
    }
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

class Account {
public:
    void deposit(long long amount) {
        balance_ += amount;
    }

    bool withdraw(long long amount) {
        if (amount > balance_) return false;
        balance_ -= amount;
        return true;
    }

    long long balance() const {
        return balance_;
    }

private:
    long long balance_ = 0;
};

int main() {
    int n;
    cin >> n;
    Account account;
    while (n--) {
        string op;
        cin >> op;
        if (op == "DEPOSIT") {
            long long x;
            cin >> x;
            account.deposit(x);
            cout << "OK\n";
        } else if (op == "WITHDRAW") {
            long long x;
            cin >> x;
            cout << (account.withdraw(x) ? "OK" : "ERROR") << '\n';
        } else {
            cout << account.balance() << '\n';
        }
    }
    return 0;
}`,
      ),
    },
    idea:
      'Account 类维护私有余额，对外提供 deposit、withdraw、balance 三个方法。withdraw 先检查余额，再决定是否扣款并返回结果。',
    pitfalls: ['取款失败仍然扣款。', '余额用 int 存储大额操作。', '余额字段设为 public，外部随意修改。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-oop',
    id: 'cpp-oop-02',
    slug: 'library-borrow',
    title: '图书馆借阅',
    order: 14,
    difficulty: 'medium',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['cpp-oop', 'cpp-stl'],
    prerequisites: ['cpp-oop-01'],
    estimatedMinutes: 22,
    summary: '用类维护每本书的可借数量，处理借书和还书。',
    statement: {
      scenarioText:
        '图书馆用一个简易系统管理图书借阅。每本书有若干复本，借出时数量减一，归还时数量加一。',
      task: '实现 Library 类，处理借书和还书操作。',
      input:
        '第一行 n，表示图书种类数。接下来 n 行，每行 `id copies`。然后一行 m，接下来 m 行，每行 `BORROW id` 或 `RETURN id`。',
      output: '每次操作输出 OK 或 NO。借书时没有可借复本或 id 不存在输出 NO；还书时 id 不存在输出 NO。',
      constraints: '1 ≤ n, m ≤ 100000，0 ≤ copies ≤ 1000。',
    },
    samples: [
      {
        input: '2\n1 1\n2 0\n4\nBORROW 1\nBORROW 1\nRETURN 1\nBORROW 2\n',
        output: 'OK\nNO\nOK\nNO\n',
        explanation: '1 号书借出后无复本；归还后恢复；2 号书一直为 0。',
      },
    ],
    tests: [
      {
        input: '1\n10 2\n4\nBORROW 10\nBORROW 10\nBORROW 10\nRETURN 10\n',
        output: 'OK\nOK\nNO\nOK\n',
      },
      { input: '1\n3 1\n2\nBORROW 9\nRETURN 9\n', output: 'NO\nNO\n' },
      { input: '2\n1 0\n2 1\n3\nBORROW 2\nRETURN 2\nBORROW 1\n', output: 'OK\nOK\nNO\n' },
    ],
    hints: [
      '用 map<int,int> 保存每本书的可借数量。',
      '借书前检查 id 是否存在且数量大于 0。',
      '还书只对存在的 id 成功。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

class Library {
public:
    void addBook(int id, int copies) {
        // TODO
    }

    bool borrow(int id) {
        // TODO
        return false;
    }

    bool giveBack(int id) {
        // TODO
        return false;
    }

private:
    map<int, int> copies_;
};

int main() {
    int n;
    cin >> n;
    Library library;
    for (int i = 0; i < n; ++i) {
        int id, copies;
        cin >> id >> copies;
        library.addBook(id, copies);
    }
    int m;
    cin >> m;
    while (m--) {
        string op;
        int id;
        cin >> op >> id;
        if (op == "BORROW") cout << (library.borrow(id) ? "OK" : "NO") << '\n';
        else cout << (library.giveBack(id) ? "OK" : "NO") << '\n';
    }
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

class Library {
public:
    void addBook(int id, int copies) {
        copies_[id] += copies;
    }

    bool borrow(int id) {
        auto it = copies_.find(id);
        if (it == copies_.end() || it->second <= 0) return false;
        --it->second;
        return true;
    }

    bool giveBack(int id) {
        auto it = copies_.find(id);
        if (it == copies_.end()) return false;
        ++it->second;
        return true;
    }

private:
    map<int, int> copies_;
};

int main() {
    int n;
    cin >> n;
    Library library;
    for (int i = 0; i < n; ++i) {
        int id, copies;
        cin >> id >> copies;
        library.addBook(id, copies);
    }
    int m;
    cin >> m;
    while (m--) {
        string op;
        int id;
        cin >> op >> id;
        if (op == "BORROW") cout << (library.borrow(id) ? "OK" : "NO") << '\n';
        else cout << (library.giveBack(id) ? "OK" : "NO") << '\n';
    }
    return 0;
}`,
      ),
    },
    idea:
      'Library 类内部用 map 保存每本书的可借数量。借书成功时数量减一，还书成功时数量加一；不存在的 id 统一返回 false。',
    pitfalls: ['借书时没有检查数量。', '还书时给不存在的 id 创建了记录。', '输出 OK/NO 大小写不一致。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-template',
    id: 'cpp-template-01',
    slug: 'generic-max',
    title: '通用最大值',
    order: 15,
    difficulty: 'medium',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['cpp-templates'],
    prerequisites: ['cpp-functions-02'],
    estimatedMinutes: 14,
    summary: '用函数模板实现一组整数的最大值。',
    statement: {
      scenarioText:
        '实验数据处理中经常要对不同类型的序列求最大值。为了让代码复用，工程师决定写一个函数模板。',
      task: '实现函数模板 maximum，返回数组中的最大值。',
      input: '第一行 n，第二行 n 个整数。',
      output: '一行一个整数，表示最大值。',
      constraints: '1 ≤ n ≤ 100000，-10^9 ≤ 数值 ≤ 10^9。',
    },
    samples: [
      { input: '5\n-3 8 2 8 1\n', output: '8\n', explanation: '最大值是 8。' },
      { input: '1\n-5\n', output: '-5\n' },
    ],
    tests: [
      { input: '4\n100 0 50 25\n', output: '100\n' },
      { input: '3\n-9 -2 -7\n', output: '-2\n' },
      { input: '2\n1000000000 999999999\n', output: '1000000000\n' },
    ],
    hints: ['template <typename T> T maximum(const vector<T>& values)。', '第一个元素作为初始最大值。', '用 const T& 避免复制。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

template <typename T>
T maximum(const vector<T>& values) {
    // TODO: 返回最大值
    return values[0];
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << maximum(values) << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

template <typename T>
T maximum(const vector<T>& values) {
    T best = values[0];
    for (const T& value : values) {
        if (value > best) best = value;
    }
    return best;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << maximum(values) << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '函数模板把类型写成 T，编译器在调用时根据实参推导。最大值初始化为第一个元素，遍历时用 const T& 避免复制。',
    pitfalls: ['空数组访问 values[0]。', '模板定义放在 .cpp 中导致链接错误。', '按值传递造成不必要复制。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-template',
    id: 'cpp-template-02',
    slug: 'generic-sum',
    title: '泛型求和',
    order: 16,
    difficulty: 'medium',
    scenario: 'finance',
    scenarioLabel: '金融账单',
    knowledgePoints: ['cpp-templates'],
    prerequisites: ['cpp-template-01'],
    estimatedMinutes: 12,
    summary: '用函数模板对整数序列求和。',
    statement: {
      scenarioText:
        '账单系统里有多种整数类型，但求和逻辑一样。用一个模板函数减少重复代码。',
      task: '实现模板函数 sum，返回序列总和。',
      input: '第一行 n，第二行 n 个整数。',
      output: '一行一个整数，表示总和。',
      constraints: '1 ≤ n ≤ 100000，-10^9 ≤ 数值 ≤ 10^9，保证总和在 long long 范围内。',
    },
    samples: [
      { input: '4\n1 2 3 4\n', output: '10\n' },
      { input: '3\n-5 10 2\n', output: '7\n' },
    ],
    tests: [
      { input: '1\n1000000000\n', output: '1000000000\n' },
      { input: '5\n0 0 0 0 0\n', output: '0\n' },
      { input: '3\n1000000000 1000000000 1000000000\n', output: '3000000000\n' },
    ],
    hints: ['用 T 作为元素类型。', '初始值写 T{0} 或 T(0)。', '返回类型也用 T。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

template <typename T>
T sum(const vector<T>& values) {
    // TODO: 求和
    return T{};
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << sum(values) << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

template <typename T>
T sum(const vector<T>& values) {
    T total{};
    for (const T& value : values) total += value;
    return total;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << sum(values) << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '模板函数用 T 表示元素类型，累加器也用 T 初始化。这样同一份逻辑可以服务 int、long long 等类型。',
    pitfalls: ['累加器写成 int，导致大数溢出。', '返回类型写死为 int。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-raii',
    id: 'cpp-raii-01',
    slug: 'dynamic-array-sum',
    title: '动态数组求和',
    order: 17,
    difficulty: 'hard',
    scenario: 'system',
    scenarioLabel: '系统工具',
    knowledgePoints: ['cpp-raii', 'cpp-pointers'],
    prerequisites: ['cpp-memory-02'],
    estimatedMinutes: 18,
    summary: '用 unique_ptr 管理动态数组，避免手动 delete。',
    statement: {
      scenarioText:
        '一段旧代码使用 new[] 分配数组，异常路径上容易忘记 delete[]。请把它改造成 RAII 风格。',
      task: '读入 n 个整数，使用 unique_ptr<int[]> 管理动态数组，输出总和。',
      input: '第一行 n，第二行 n 个整数。',
      output: '一行一个整数，表示总和。',
      constraints: '1 ≤ n ≤ 100000，-10^9 ≤ 数值 ≤ 10^9，保证总和在 long long 范围内。',
    },
    samples: [
      { input: '4\n1 2 3 4\n', output: '10\n' },
      { input: '3\n-1 5 -2\n', output: '2\n' },
    ],
    tests: [
      { input: '1\n1000000000\n', output: '1000000000\n' },
      { input: '5\n0 0 0 0 0\n', output: '0\n' },
      { input: '3\n1000000000 1000000000 1000000000\n', output: '3000000000\n' },
    ],
    hints: ['用 auto data = make_unique<int[]>(n)。', 'unique_ptr 不能复制，但可以下标访问。', '不需要手动 delete[]。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    // TODO: 使用 unique_ptr<int[]> 管理数组
    auto data = make_unique<int[]>(n);
    long long total = 0;
    for (int i = 0; i < n; ++i) {
        cin >> data[i];
        total += data[i];
    }
    cout << total << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    auto data = make_unique<int[]>(n);
    long long total = 0;
    for (int i = 0; i < n; ++i) {
        cin >> data[i];
        total += data[i];
    }
    cout << total << '\n';
    return 0;
}`,
      ),
    },
    idea:
      'unique_ptr<int[]> 在离开作用域时自动释放数组，不需要手写 delete[]。它独占所有权，不能复制，适合这种一次性分配的场景。',
    pitfalls: ['用 unique_ptr 后又手动 delete[]，造成重复释放。', '试图复制 unique_ptr。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-stream',
    id: 'cpp-stream-01',
    slug: 'log-summary',
    title: '日志级别统计',
    order: 18,
    difficulty: 'medium',
    scenario: 'system',
    scenarioLabel: '系统工具',
    knowledgePoints: ['cpp-streams', 'cpp-strings'],
    prerequisites: ['cpp-stl-01'],
    estimatedMinutes: 18,
    summary: '读取多行日志，按级别统计 ERROR、WARN、INFO 的数量。',
    statement: {
      scenarioText:
        '运维同学需要快速了解一段服务日志的严重程度分布。日志每行以级别开头，后面是描述。',
      task: '统计三种日志级别出现的次数。',
      input: '第一行 n。接下来 n 行，每行 `LEVEL message`。级别只会是 ERROR、WARN、INFO。',
      output: '三行，依次为 `ERROR x`、`WARN y`、`INFO z`。',
      constraints: '1 ≤ n ≤ 100000，每行长度不超过 200。',
    },
    samples: [
      {
        input: '3\nERROR disk full\nWARN memory high\nINFO started\n',
        output: 'ERROR 1\nWARN 1\nINFO 1\n',
      },
    ],
    tests: [
      { input: '1\nERROR boom\n', output: 'ERROR 1\nWARN 0\nINFO 0\n' },
      { input: '4\nINFO a\nINFO b\nWARN c\nINFO d\n', output: 'ERROR 0\nWARN 1\nINFO 3\n' },
      { input: '2\nWARN x\nERROR y\n', output: 'ERROR 1\nWARN 1\nINFO 0\n' },
    ],
    hints: [
      '读入 n 后要用 cin.ignore() 清掉换行。',
      '用 getline 读整行，再用 stringstream 取第一个词。',
      '只统计三个已知级别。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    int errors = 0, warns = 0, infos = 0;
    // TODO: 读取 n 行并统计
    cout << "ERROR " << errors << '\n';
    cout << "WARN " << warns << '\n';
    cout << "INFO " << infos << '\n';
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    int errors = 0, warns = 0, infos = 0;
    for (int i = 0; i < n; ++i) {
        string line;
        getline(cin, line);
        stringstream ss(line);
        string level;
        ss >> level;
        if (level == "ERROR") ++errors;
        else if (level == "WARN") ++warns;
        else if (level == "INFO") ++infos;
    }
    cout << "ERROR " << errors << '\n';
    cout << "WARN " << warns << '\n';
    cout << "INFO " << infos << '\n';
    return 0;
}`,
      ),
    },
    idea:
      '先用 cin.ignore 清掉整数后的换行，再循环 getline 读整行。用 stringstream 取出第一个单词作为级别，分别计数。',
    pitfalls: ['cin >> n 后直接 getline 会读到空行。', '只读第一个单词导致描述丢失。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-modern',
    id: 'cpp-modern-01',
    slug: 'score-filter',
    title: '成绩筛选',
    order: 19,
    difficulty: 'hard',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['cpp-modern', 'cpp-sort'],
    prerequisites: ['cpp-stl-01'],
    estimatedMinutes: 15,
    summary: '用现代 C++ 的 lambda 与算法筛选并排序成绩。',
    statement: {
      scenarioText:
        '老师想快速查看所有及格成绩，并按从高到低排列。请用现代 C++ 的写法完成筛选。',
      task: '筛选出 ≥60 的成绩，按降序输出；没有及格成绩输出 EMPTY。',
      input: '第一行 n，第二行 n 个整数成绩。',
      output: '一行若干个整数，空格分隔；没有则输出 EMPTY。',
      constraints: '1 ≤ n ≤ 100000，0 ≤ 成绩 ≤ 100。',
    },
    samples: [
      { input: '6\n59 80 60 100 45 75\n', output: '100 80 75 60\n' },
      { input: '2\n10 20\n', output: 'EMPTY\n' },
    ],
    tests: [
      { input: '1\n60\n', output: '60\n' },
      { input: '3\n100 100 99\n', output: '100 100 99\n' },
      { input: '4\n0 59 59 0\n', output: 'EMPTY\n' },
    ],
    hints: ['用 copy_if 或循环 + lambda 筛选。', '用 sort 的 greater<int>() 降序。', '注意空结果输出 EMPTY。'],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> scores(n);
    for (int& score : scores) cin >> score;
    vector<int> passed;
    // TODO: 筛选 >= 60 并降序排序
    if (passed.empty()) {
        cout << "EMPTY\n";
    } else {
        for (size_t i = 0; i < passed.size(); ++i) {
            if (i) cout << ' ';
            cout << passed[i];
        }
        cout << '\n';
    }
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> scores(n);
    for (int& score : scores) cin >> score;
    vector<int> passed;
    copy_if(scores.begin(), scores.end(), back_inserter(passed),
            [](int score) { return score >= 60; });
    sort(passed.begin(), passed.end(), greater<int>());
    if (passed.empty()) {
        cout << "EMPTY\n";
    } else {
        for (size_t i = 0; i < passed.size(); ++i) {
            if (i) cout << ' ';
            cout << passed[i];
        }
        cout << '\n';
    }
    return 0;
}`,
      ),
    },
    idea:
      'copy_if 按谓词筛选，back_inserter 把结果追加到新 vector，sort 配合 greater<int> 完成降序。lambda 把“及格”这个业务规则直接写在筛选处。',
    pitfalls: ['忘记处理空结果。', '降序写成默认升序。', 'copy_if 没有 back_inserter。'],
  },
  {
    track: 'cpp',
    moduleId: 'cpp-capstone',
    id: 'cpp-capstone-01',
    slug: 'mini-inventory',
    title: '综合项目：小型库存管理器',
    order: 20,
    difficulty: 'challenge',
    scenario: 'retail',
    scenarioLabel: '商业零售',
    knowledgePoints: ['cpp-capstone', 'cpp-stl', 'cpp-oop', 'cpp-streams'],
    prerequisites: ['cpp-oop-02', 'cpp-stream-01'],
    estimatedMinutes: 30,
    summary: '解析 ADD / SELL / QUERY 命令，用 map 维护库存并处理失败操作。',
    statement: {
      scenarioText:
        '一家小商店需要一个命令行库存管理器。店员可以入库、销售和查询商品数量。',
      task: '实现一个库存系统，处理 n 条命令。',
      input:
        '第一行 n。接下来 n 行，格式为 `ADD name qty`、`SELL name qty` 或 `QUERY name`。name 不含空格，qty 为正整数。',
      output:
        'ADD 成功输出 OK；SELL 库存足够输出 OK，否则输出 NO；QUERY 输出当前数量，不存在输出 0。',
      constraints: '1 ≤ n ≤ 100000，1 ≤ qty ≤ 10^9，商品名长度不超过 30。',
    },
    samples: [
      {
        input: '7\nADD apple 10\nSELL apple 3\nQUERY apple\nSELL apple 10\nADD pear 5\nQUERY pear\nQUERY banana\n',
        output: 'OK\nOK\n7\nNO\nOK\n5\n0\n',
        explanation: 'apple 入库 10，卖出 3 剩 7；再卖 10 失败；pear 入库 5；banana 不存在。',
      },
    ],
    tests: [
      {
        input: '5\nADD a 3\nADD a 2\nSELL a 4\nQUERY a\nSELL a 2\n',
        output: 'OK\nOK\nOK\n1\nNO\n',
      },
      { input: '3\nQUERY x\nADD x 1\nQUERY x\n', output: '0\nOK\n1\n' },
      { input: '4\nADD b 1000000000\nSELL b 999999999\nQUERY b\nSELL b 1\n', output: 'OK\nOK\n1\nOK\n' },
    ],
    hints: [
      '用 map<string, long long> 保存库存。',
      '先读 op 和 name，只有 ADD/SELL 才继续读 qty。',
      'SELL 前先检查库存是否足够。',
    ],
    languages: {
      cpp: cpp(
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, long long> stock;
    while (n--) {
        string op, name;
        cin >> op >> name;
        if (op == "ADD") {
            long long qty;
            cin >> qty;
            stock[name] += qty;
            cout << "OK\n";
        } else if (op == "SELL") {
            long long qty;
            cin >> qty;
            // TODO: 判断库存并扣减
            cout << "NO\n";
        } else {
            // TODO: 输出当前库存
            cout << 0 << '\n';
        }
    }
    return 0;
}`,
        raw`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, long long> stock;
    while (n--) {
        string op, name;
        cin >> op >> name;
        if (op == "ADD") {
            long long qty;
            cin >> qty;
            stock[name] += qty;
            cout << "OK\n";
        } else if (op == "SELL") {
            long long qty;
            cin >> qty;
            if (stock[name] >= qty) {
                stock[name] -= qty;
                cout << "OK\n";
            } else {
                cout << "NO\n";
            }
        } else {
            cout << stock[name] << '\n';
        }
    }
    return 0;
}`,
      ),
    },
    idea:
      '用 map 保存每个商品的库存。ADD 累加；SELL 先检查再扣减；QUERY 直接输出（map 下标访问对不存在的键返回 0）。命令读取顺序要和输入格式一致。',
    pitfalls: ['SELL 库存不足仍扣成负数。', 'QUERY 也去读 qty，导致后续命令错位。', 'qty 用 int 存储大数。'],
  },
];

export async function seedCppProblems() {
  for (const problem of problems) {
    await writeProblem(problem);
  }
  console.log(`cpp problems generated: ${problems.length}`);
}
