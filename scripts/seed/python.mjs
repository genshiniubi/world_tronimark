import { writeProblem } from './helpers.mjs';

const python = (starter, solution, entry = 'src/main.py') => ({ starter, solution, entry });
const raw = String.raw;

const problems = [
  {
    track: 'python',
    moduleId: 'py-start',
    id: 'py-start-01',
    slug: 'coffee-order',
    title: '咖啡店订单',
    order: 1,
    difficulty: 'beginner',
    scenario: 'retail',
    scenarioLabel: '商业零售',
    knowledgePoints: ['py-io', 'py-types'],
    prerequisites: [],
    estimatedMinutes: 10,
    summary: '读入单价、杯数和折扣，用 f-string 输出两位小数金额。',
    statement: {
      scenarioText:
        '街角咖啡店上线了自助点单。顾客选择咖啡、输入杯数和会员折扣，系统需要显示应付金额。',
      task: '计算订单实付金额，保留两位小数。',
      input: '一行三个数：单价 price、杯数 count、折扣百分比 discount。',
      output: '一行一个实数，保留两位小数。',
      constraints: '1 ≤ price ≤ 1000，1 ≤ count ≤ 100，0 ≤ discount ≤ 100。',
    },
    samples: [
      {
        input: '18.5 2 10\n',
        output: '33.30\n',
        explanation: '原价 37.0，打九折后 33.3。',
      },
      { input: '12 1 0\n', output: '12.00\n' },
    ],
    tests: [
      { input: '20 3 25\n', output: '45.00\n' },
      { input: '1.5 4 0\n', output: '6.00\n' },
      { input: '99.9 2 100\n', output: '0.00\n' },
    ],
    hints: [
      'input().split() 可以一次读三个值。',
      'price 用 float，count 和 discount 用 int。',
      '使用 f"{total:.2f}" 格式化。',
    ],
    languages: {
      python: python(
        `price, count, discount = input().split()
price = float(price)
count = int(count)
discount = int(discount)

# TODO: 计算实付金额
total = 0.0
print(f"{total:.2f}")`,
        `price, count, discount = input().split()
price = float(price)
count = int(count)
discount = int(discount)

subtotal = price * count
total = subtotal * (100 - discount) / 100
print(f"{total:.2f}")`,
      ),
    },
    idea:
      '先把输入拆成三个值并转换类型，再按“原价 × 折扣比例”计算。f-string 的 `:.2f` 负责固定两位小数。',
    pitfalls: ['忘记把 price 转成 float。', '折扣百分比没有除以 100。'],
  },
  {
    track: 'python',
    moduleId: 'py-start',
    id: 'py-start-02',
    slug: 'currency-convert',
    title: '汇率换算',
    order: 2,
    difficulty: 'beginner',
    scenario: 'finance',
    scenarioLabel: '金融账单',
    knowledgePoints: ['py-io', 'py-types'],
    prerequisites: ['py-start-01'],
    estimatedMinutes: 8,
    summary: '把人民币金额按给定汇率换算成美元。',
    statement: {
      scenarioText:
        '出国旅行前，你需要快速估算手里的人民币能换多少美元。汇率表示 1 美元需要多少人民币。',
      task: '按汇率把人民币换算成美元，保留两位小数。',
      input: '一行两个数：人民币金额 cny、汇率 rate（1 美元兑多少人民币）。',
      output: '一行一个实数，表示美元金额，保留两位小数。',
      constraints: '0 ≤ cny ≤ 10^9，0.01 ≤ rate ≤ 100。',
    },
    samples: [
      { input: '720 7.2\n', output: '100.00\n', explanation: '720 ÷ 7.2 = 100。' },
      { input: '100 8\n', output: '12.50\n' },
    ],
    tests: [
      { input: '0 7\n', output: '0.00\n' },
      { input: '50 8\n', output: '6.25\n' },
      { input: '999 7.1\n', output: '140.70\n' },
    ],
    hints: ['cny 和 rate 都转成 float。', '美元金额 = cny / rate。', '输出格式化为两位小数。'],
    languages: {
      python: python(
        `cny, rate = input().split()
cny = float(cny)
rate = float(rate)
# TODO: 计算美元金额
usd = 0.0
print(f"{usd:.2f}")`,
        `cny, rate = input().split()
cny = float(cny)
rate = float(rate)
usd = cny / rate
print(f"{usd:.2f}")`,
      ),
    },
    idea:
      '汇率是“1 美元兑多少人民币”，所以人民币除以汇率得到美元。输入需要转成浮点数，输出保留两位小数。',
    pitfalls: ['把除法写反。', '整数相除导致小数丢失。'],
  },
  {
    track: 'python',
    moduleId: 'py-control',
    id: 'py-control-01',
    slug: 'weather-alert',
    title: '天气预警',
    order: 3,
    difficulty: 'beginner',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['py-conditions'],
    prerequisites: ['py-start-02'],
    estimatedMinutes: 12,
    summary: '根据温度和风力输出四级天气预警。',
    statement: {
      scenarioText:
        '气象站需要根据温度和风力自动发布预警。规则从高到低依次判断，满足最高等级就停止。',
      task: '输出 RED、ORANGE、YELLOW 或 GREEN。',
      input: '一行两个整数：温度 temperature、风力 wind。',
      output: '一行预警等级。',
      constraints:
        '规则：温度 ≥ 35 或风力 ≥ 10 → RED；温度 ≥ 30 或风力 ≥ 7 → ORANGE；温度 ≥ 25 → YELLOW；否则 GREEN。',
    },
    samples: [
      { input: '36 3\n', output: 'RED\n', explanation: '温度达到 35。' },
      { input: '28 8\n', output: 'ORANGE\n', explanation: '风力达到 7。' },
      { input: '26 2\n', output: 'YELLOW\n' },
    ],
    tests: [
      { input: '20 1\n', output: 'GREEN\n' },
      { input: '30 0\n', output: 'ORANGE\n' },
      { input: '25 0\n', output: 'YELLOW\n' },
      { input: '0 10\n', output: 'RED\n' },
    ],
    hints: ['用 if / elif / else 从最高等级往下判断。', '条件之间是“或”的关系。', '一旦满足最高等级就不要再往下判断。'],
    languages: {
      python: python(
        `temperature, wind = map(int, input().split())

# TODO: 按规则输出预警等级
print("GREEN")`,
        `temperature, wind = map(int, input().split())

if temperature >= 35 or wind >= 10:
    print("RED")
elif temperature >= 30 or wind >= 7:
    print("ORANGE")
elif temperature >= 25:
    print("YELLOW")
else:
    print("GREEN")`,
      ),
    },
    idea:
      '从最高等级开始判断，使用 `or` 连接温度和风力条件。因为 `elif` 只会执行第一个成立的分支，所以不需要重复排除更高等级。',
    pitfalls: ['从低到高判断，导致高等级永远不触发。', '把“或”写成“且”。'],
  },
  {
    track: 'python',
    moduleId: 'py-control',
    id: 'py-control-02',
    slug: 'parcel-codes',
    title: '快递柜取件码',
    order: 4,
    difficulty: 'easy',
    scenario: 'life',
    scenarioLabel: '生活服务',
    knowledgePoints: ['py-loops', 'py-strings'],
    prerequisites: ['py-control-01'],
    estimatedMinutes: 12,
    summary: '统计一组取件码中格式正确的数量。',
    statement: {
      scenarioText:
        '快递柜的取件码必须是 6 位数字。系统导入了一批历史数据，需要先找出格式正确的取件码。',
      task: '统计 6 位纯数字取件码的数量。',
      input: '第一行 n。第二行 n 个取件码，用空格分隔。',
      output: '一行一个整数，表示合法取件码数量。',
      constraints: '1 ≤ n ≤ 100000，取件码为非空字符串。',
    },
    samples: [
      {
        input: '5\n123456 12ab56 654321 12345 000000\n',
        output: '3\n',
        explanation: '123456、654321、000000 合法。',
      },
      { input: '1\n12345\n', output: '0\n' },
    ],
    tests: [
      { input: '2\n111111 222222\n', output: '2\n' },
      { input: '3\n1234567 12345 000001\n', output: '1\n' },
      { input: '1\nabcdef\n', output: '0\n' },
    ],
    hints: ['len(code) == 6 且 code.isdigit()。', '注意取件码可能以 0 开头，不要转成 int 再判断。', '用循环累计合法数量。'],
    languages: {
      python: python(
        `n = int(input())
codes = input().split()

valid = 0
# TODO: 统计合法取件码
print(valid)`,
        `n = int(input())
codes = input().split()

valid = 0
for code in codes:
    if len(code) == 6 and code.isdigit():
        valid += 1
print(valid)`,
      ),
    },
    idea:
      '取件码可能以 0 开头，因此必须按字符串处理。合法条件是长度为 6 且全部为数字，用 `isdigit()` 判断最直接。',
    pitfalls: ['先转 int，丢失前导 0 和长度信息。', '忘记判断长度。'],
  },
  {
    track: 'python',
    moduleId: 'py-functions',
    id: 'py-functions-01',
    slug: 'bill-split',
    title: '账单分摊',
    order: 5,
    difficulty: 'easy',
    scenario: 'finance',
    scenarioLabel: '金融账单',
    knowledgePoints: ['py-functions'],
    prerequisites: ['py-control-02'],
    estimatedMinutes: 12,
    summary: '把总金额、人数和小费比例封装成分摊函数。',
    statement: {
      scenarioText:
        '朋友聚餐后需要 AA 账单。总金额之外还要加一定比例的小费，最后平均分给每个人。',
      task: '实现 split_bill(total, people, tip_percent)，返回每人应付金额。',
      input: '一行三个数：总金额 total、人数 people、小费百分比 tip_percent。',
      output: '一行一个实数，表示每人应付金额，保留两位小数。',
      constraints: '0 ≤ total ≤ 10^6，1 ≤ people ≤ 100，0 ≤ tip_percent ≤ 100。',
    },
    samples: [
      { input: '300 3 10\n', output: '110.00\n', explanation: '300 × 1.1 ÷ 3 = 110。' },
      { input: '100 4 0\n', output: '25.00\n' },
    ],
    tests: [
      { input: '0 5 20\n', output: '0.00\n' },
      { input: '199.9 2 15\n', output: '114.94\n' },
      { input: '50 3 10\n', output: '18.33\n' },
    ],
    hints: ['函数签名建议带默认参数 tip_percent=0。', '先算含小费总额，再除以人数。', '输出格式在 main 流程里处理。'],
    languages: {
      python: python(
        `def split_bill(total, people, tip_percent=0):
    # TODO: 返回每人应付金额
    return 0.0

total, people, tip_percent = input().split()
total = float(total)
people = int(people)
tip_percent = float(tip_percent)
print(f"{split_bill(total, people, tip_percent):.2f}")`,
        `def split_bill(total, people, tip_percent=0):
    return total * (1 + tip_percent / 100) / people

total, people, tip_percent = input().split()
total = float(total)
people = int(people)
tip_percent = float(tip_percent)
print(f"{split_bill(total, people, tip_percent):.2f}")`,
      ),
    },
    idea:
      '函数先计算含小费的总金额，再除以人数。把计算封装起来后，输出格式和业务逻辑分开，便于复用和测试。',
    pitfalls: ['小费百分比没有除以 100。', '人数为 0 导致除零。'],
  },
  {
    track: 'python',
    moduleId: 'py-functions',
    id: 'py-functions-02',
    slug: 'prime-check',
    title: '素数判断',
    order: 6,
    difficulty: 'medium',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['py-functions', 'py-loops'],
    prerequisites: ['py-functions-01'],
    estimatedMinutes: 15,
    summary: '实现 is_prime 函数，用试除法判断素数。',
    statement: {
      scenarioText:
        '在生成实验编号时，需要跳过合数。请实现一个可靠的素数判断函数。',
      task: '判断给定的正整数是否为素数。',
      input: '一行一个整数 n。',
      output: '是素数输出 YES，否则输出 NO。',
      constraints: '1 ≤ n ≤ 10^12。',
    },
    samples: [
      { input: '7\n', output: 'YES\n', explanation: '7 只能被 1 和自身整除。' },
      { input: '1\n', output: 'NO\n' },
      { input: '9\n', output: 'NO\n' },
    ],
    tests: [
      { input: '2\n', output: 'YES\n' },
      { input: '97\n', output: 'YES\n' },
      { input: '1000000007\n', output: 'YES\n' },
      { input: '9999999967\n', output: 'YES\n' },
    ],
    hints: ['1 不是素数。', '只需试除到 int(sqrt(n))。', '2 是唯一的偶数素数。'],
    languages: {
      python: python(
        `def is_prime(n):
    # TODO: 判断素数
    return False

n = int(input())
print("YES" if is_prime(n) else "NO")`,
        `def is_prime(n):
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

n = int(input())
print("YES" if is_prime(n) else "NO")`,
      ),
    },
    idea:
      '先处理 1 和偶数，再从 3 开始只试奇数因子，循环到 i*i > n。这样比逐个试除快得多，能处理 10^12 范围。',
    pitfalls: ['把 1 当成素数。', '循环到 n，超时。', '没有单独处理 2。'],
  },
  {
    track: 'python',
    moduleId: 'py-containers',
    id: 'py-containers-01',
    slug: 'grade-analysis',
    title: '成绩分析',
    order: 7,
    difficulty: 'easy',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['py-list'],
    prerequisites: ['py-functions-02'],
    estimatedMinutes: 12,
    summary: '用列表保存成绩，计算平均分、最高分、最低分和及格人数。',
    statement: {
      scenarioText:
        '老师把一次测验的成绩交给你，希望快速得到班级的整体情况。',
      task: '输出平均分（两位小数）、最高分、最低分和及格人数。',
      input: '第一行 n，第二行 n 个整数成绩。',
      output: '一行：平均分 最高分 最低分 及格人数。',
      constraints: '1 ≤ n ≤ 100000，0 ≤ 成绩 ≤ 100。',
    },
    samples: [
      { input: '5\n90 80 70 60 50\n', output: '70.00 90 50 4\n' },
      { input: '3\n59 58 57\n', output: '58.00 59 57 0\n' },
    ],
    tests: [
      { input: '1\n100\n', output: '100.00 100 100 1\n' },
      { input: '4\n0 100 100 0\n', output: '50.00 100 0 2\n' },
      { input: '6\n60 61 62 63 64 65\n', output: '62.50 65 60 6\n' },
    ],
    hints: ['用 list(map(int, input().split())) 读入。', 'sum / len 求平均。', '生成器表达式配合 sum 统计及格人数。'],
    languages: {
      python: python(
        `n = int(input())
scores = list(map(int, input().split()))

# TODO: 计算平均分、最高分、最低分、及格人数
average = 0
maximum = 0
minimum = 0
pass_count = 0
print(f"{average:.2f} {maximum} {minimum} {pass_count}")`,
        `n = int(input())
scores = list(map(int, input().split()))

average = sum(scores) / n
maximum = max(scores)
minimum = min(scores)
pass_count = sum(1 for score in scores if score >= 60)
print(f"{average:.2f} {maximum} {minimum} {pass_count}")`,
      ),
    },
    idea:
      '列表保存整批成绩后，可以直接使用内置的 sum、max、min。及格人数用生成器表达式统计，避免额外循环。',
    pitfalls: ['平均分用整除。', '及格条件写成 >60。'],
  },
  {
    track: 'python',
    moduleId: 'py-containers',
    id: 'py-containers-02',
    slug: 'word-count',
    title: '单词统计',
    order: 8,
    difficulty: 'medium',
    scenario: 'text',
    scenarioLabel: '文本处理',
    knowledgePoints: ['py-dict', 'py-list'],
    prerequisites: ['py-containers-01'],
    estimatedMinutes: 15,
    summary: '用字典统计词频，输出去重数量和出现最多的单词。',
    statement: {
      scenarioText:
        '内容团队想了解一篇文章里哪些词出现得最多，以及用词丰富度如何。',
      task: '输出去重后的单词数量，以及出现次数最多的单词；并列时取字典序最小的。',
      input: '第一行 n，第二行 n 个不含空格的小写单词。',
      output: '一行：unique_count top_word。',
      constraints: '1 ≤ n ≤ 100000，单词长度不超过 30。',
    },
    samples: [
      {
        input: '6\napple banana apple cherry banana apple\n',
        output: '3 apple\n',
        explanation: '3 个不同单词；apple 出现 3 次。',
      },
      { input: '3\nb a c\n', output: '3 a\n' },
    ],
    tests: [
      { input: '1\nhello\n', output: '1 hello\n' },
      { input: '4\nx y y x\n', output: '2 x\n' },
      { input: '3\nz z a\n', output: '2 z\n' },
    ],
    hints: ['用 dict 或 collections.Counter。', 'top_word 排序规则：次数降序，单词升序。', '去重数量就是字典长度。'],
    languages: {
      python: python(
        `n = int(input())
words = input().split()

# TODO: 统计词频与 top word
print(0, "")`,
        `n = int(input())
words = input().split()

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
top_word = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]
print(len(counts), top_word)`,
      ),
    },
    idea:
      '用字典累计词频，排序时把键设计成 `(次数降序, 单词升序)`。Python 的排序是稳定的，但这里直接用二元 key 更清楚。',
    pitfalls: ['并列时没有按字典序处理。', '把去重数量写成 n。'],
  },
  {
    track: 'python',
    moduleId: 'py-text',
    id: 'py-text-01',
    slug: 'log-clean',
    title: '日志清洗',
    order: 9,
    difficulty: 'medium',
    scenario: 'system',
    scenarioLabel: '系统工具',
    knowledgePoints: ['py-strings', 'py-files'],
    prerequisites: ['py-containers-02'],
    estimatedMinutes: 15,
    summary: '清洗多行日志，统计 ERROR 级别出现的次数。',
    statement: {
      scenarioText:
        '服务日志里混着各种级别。运维同学只关心错误数量，并希望忽略行首尾空白。',
      task: '读取 n 行日志，统计以 ERROR 开头的行数。',
      input: '第一行 n。接下来 n 行，每行 `LEVEL message`。',
      output: '一行一个整数，表示 ERROR 行数。',
      constraints: '1 ≤ n ≤ 100000，每行长度不超过 200。',
    },
    samples: [
      {
        input: '3\nERROR disk full\nWARN memory high\n  ERROR retry\n',
        output: '2\n',
        explanation: '两行以 ERROR 开头（忽略前导空格）。',
      },
    ],
    tests: [
      { input: '1\nINFO started\n', output: '0\n' },
      { input: '3\nERROR a\nERROR b\nINFO c\n', output: '2\n' },
      { input: '2\nWARN x\nERROR y\n', output: '1\n' },
    ],
    hints: ['用 sys.stdin.readline 读整行。', '先 line.strip() 再 startswith("ERROR")。', '不要用 input() 和 split() 丢掉消息内容。'],
    languages: {
      python: python(
        `import sys

n = int(sys.stdin.readline())
errors = 0
# TODO: 统计 ERROR 行
print(errors)`,
        `import sys

n = int(sys.stdin.readline())
errors = 0
for _ in range(n):
    line = sys.stdin.readline().strip()
    if line.startswith("ERROR"):
        errors += 1
print(errors)`,
      ),
    },
    idea:
      '读取整行后用 strip 去掉行首尾空白，再判断是否以 ERROR 开头。只统计级别，不需要切分整条消息。',
    pitfalls: ['用 input().split() 只拿到第一个词，但这里其实够用；不过消息中包含空格时容易误判。', '忘记忽略前导空格。'],
  },
  {
    track: 'python',
    moduleId: 'py-text',
    id: 'py-text-02',
    slug: 'palindrome-sentence',
    title: '回文句子',
    order: 10,
    difficulty: 'medium',
    scenario: 'text',
    scenarioLabel: '文本处理',
    knowledgePoints: ['py-strings'],
    prerequisites: ['py-text-01'],
    estimatedMinutes: 12,
    summary: '忽略大小写、空格和标点，判断句子是否回文。',
    statement: {
      scenarioText:
        '语言社团在收集回文句子。判断时需要忽略大小写、空格和标点符号，只看字母和数字。',
      task: '判断清洗后的句子是否为回文。',
      input: '一行文本，可能包含空格和标点。',
      output: '是回文输出 YES，否则输出 NO。',
      constraints: '1 ≤ 行长度 ≤ 100000。',
    },
    samples: [
      {
        input: 'A man, a plan, a canal: Panama\n',
        output: 'YES\n',
        explanation: '清洗后为 amanaplanacanalpanama，是回文。',
      },
      { input: 'Hello, world!\n', output: 'NO\n' },
    ],
    tests: [
      { input: 'Racecar\n', output: 'YES\n' },
      { input: 'No lemon, no melon\n', output: 'YES\n' },
      { input: 'abc\n', output: 'NO\n' },
    ],
    hints: ['只保留 ch.isalnum() 的字符。', '统一转成小写。', '比较清洗后的字符串和它的反转。'],
    languages: {
      python: python(
        `line = input()

# TODO: 清洗并判断回文
print("NO")`,
        `line = input()

cleaned = "".join(ch.lower() for ch in line if ch.isalnum())
print("YES" if cleaned == cleaned[::-1] else "NO")`,
      ),
    },
    idea:
      '用生成器表达式保留字母和数字，同时转成小写。Python 的切片 `[::-1]` 可以快速反转字符串，再与原串比较。',
    pitfalls: ['只去掉空格，没有去掉标点。', '忘记统一大小写。'],
  },
  {
    track: 'python',
    moduleId: 'py-exceptions',
    id: 'py-exceptions-01',
    slug: 'safe-division',
    title: '安全除法',
    order: 11,
    difficulty: 'medium',
    scenario: 'finance',
    scenarioLabel: '金融账单',
    knowledgePoints: ['py-exceptions'],
    prerequisites: ['py-functions-02'],
    estimatedMinutes: 12,
    summary: '用异常处理完成除法，遇到非法输入返回 ERROR。',
    statement: {
      scenarioText:
        '一个报表工具需要处理用户输入的除法。输入可能是非数字，也可能除以 0，程序不能崩溃。',
      task: '计算 a / b，保留两位小数；任何非法输入或除零都输出 ERROR。',
      input: '一行两个字符串 a 和 b。',
      output: '成功输出结果，失败输出 ERROR。',
      constraints: '输入长度不超过 100。',
    },
    samples: [
      { input: '10 4\n', output: '2.50\n' },
      { input: '10 0\n', output: 'ERROR\n' },
      { input: 'abc 2\n', output: 'ERROR\n' },
    ],
    tests: [
      { input: '1 3\n', output: '0.33\n' },
      { input: '-5 2\n', output: '-2.50\n' },
      { input: '1.5 0.5\n', output: '3.00\n' },
    ],
    hints: ['把转换和除法都放进 try。', '捕获 ValueError 和 ZeroDivisionError。', '用 else 处理成功分支。'],
    languages: {
      python: python(
        `a, b = input().split()

# TODO: 使用 try/except 安全计算
print("ERROR")`,
        `a, b = input().split()

try:
    result = float(a) / float(b)
except (ValueError, ZeroDivisionError):
    print("ERROR")
else:
    print(f"{result:.2f}")`,
      ),
    },
    idea:
      '`float(a)` 可能抛出 ValueError，除以 0 会抛出 ZeroDivisionError。把这两类异常放在同一个 except 中处理，成功时用 else 输出结果。',
    pitfalls: ['只捕获一种异常。', '用裸 except 吞掉所有错误。', '除零后继续使用结果。'],
  },
  {
    track: 'python',
    moduleId: 'py-oop',
    id: 'py-oop-01',
    slug: 'bank-account-py',
    title: '银行账户（Python）',
    order: 12,
    difficulty: 'medium',
    scenario: 'finance',
    scenarioLabel: '金融账单',
    knowledgePoints: ['py-oop'],
    prerequisites: ['py-exceptions-01'],
    estimatedMinutes: 20,
    summary: '用类封装余额，处理存款、取款和查询。',
    statement: {
      scenarioText:
        '一个简易银行系统需要处理账户操作。取款不能透支；每次操作都要给出明确结果。',
      task: '实现 Account 类，处理 n 条命令。',
      input:
        '第一行 n。接下来 n 行，每行 `DEPOSIT x`、`WITHDRAW x` 或 `BALANCE`。初始余额为 0。',
      output:
        'DEPOSIT 和成功的 WITHDRAW 输出 OK；余额不足的 WITHDRAW 输出 ERROR；BALANCE 输出余额。',
      constraints: '1 ≤ n ≤ 100000，0 ≤ x ≤ 10^9。',
    },
    samples: [
      {
        input: '6\nDEPOSIT 100\nWITHDRAW 30\nBALANCE\nWITHDRAW 100\nDEPOSIT 20\nBALANCE\n',
        output: 'OK\nOK\n70\nERROR\nOK\n90\n',
      },
    ],
    tests: [
      { input: '3\nBALANCE\nDEPOSIT 5\nBALANCE\n', output: '0\nOK\n5\n' },
      { input: '2\nWITHDRAW 1\nDEPOSIT 10\n', output: 'ERROR\nOK\n' },
      { input: '4\nDEPOSIT 1000000000\nDEPOSIT 1000000000\nWITHDRAW 2000000000\nBALANCE\n', output: 'OK\nOK\nOK\n0\n' },
    ],
    hints: ['在 __init__ 中设置 self.balance = 0。', 'withdraw 返回 bool。', '命令用 split 解析。'],
    languages: {
      python: python(
        `class Account:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        # TODO
        pass

    def withdraw(self, amount):
        # TODO
        return False


n = int(input())
account = Account()
for _ in range(n):
    parts = input().split()
    if parts[0] == "DEPOSIT":
        account.deposit(int(parts[1]))
        print("OK")
    elif parts[0] == "WITHDRAW":
        print("OK" if account.withdraw(int(parts[1])) else "ERROR")
    else:
        print(account.balance)`,
        `class Account:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True


n = int(input())
account = Account()
for _ in range(n):
    parts = input().split()
    if parts[0] == "DEPOSIT":
        account.deposit(int(parts[1]))
        print("OK")
    elif parts[0] == "WITHDRAW":
        print("OK" if account.withdraw(int(parts[1])) else "ERROR")
    else:
        print(account.balance)`,
      ),
    },
    idea:
      'Account 把余额作为实例属性，deposit 和 withdraw 维护状态。withdraw 先检查余额，失败时返回 False，不改变状态。',
    pitfalls: ['取款失败仍然扣款。', '忘记写 self。', '余额字段被外部随意修改。'],
  },
  {
    track: 'python',
    moduleId: 'py-iterators',
    id: 'py-iterators-01',
    slug: 'fibonacci-generator',
    title: '斐波那契生成器',
    order: 13,
    difficulty: 'medium',
    scenario: 'science',
    scenarioLabel: '科学计算',
    knowledgePoints: ['py-generators'],
    prerequisites: ['py-functions-01'],
    estimatedMinutes: 15,
    summary: '用 yield 生成前 n 个斐波那契数。',
    statement: {
      scenarioText:
        '数学小组想研究斐波那契数列。为了避免一次性占用大量内存，他们希望用生成器逐个产生数字。',
      task: '实现生成器 fibonacci(n)，依次产生前 n 个斐波那契数。',
      input: '一行一个整数 n。',
      output: '一行 n 个整数，用空格分隔。',
      constraints: '1 ≤ n ≤ 100000。',
    },
    samples: [
      { input: '5\n', output: '0 1 1 2 3\n' },
      { input: '1\n', output: '0\n' },
    ],
    tests: [
      { input: '2\n', output: '0 1\n' },
      { input: '7\n', output: '0 1 1 2 3 5 8\n' },
      { input: '10\n', output: '0 1 1 2 3 5 8 13 21 34\n' },
    ],
    hints: ['生成器用 yield 而不是 return。', '维护 a, b 两个变量。', 'n=1 时只输出 0。'],
    languages: {
      python: python(
        `def fibonacci(n):
    # TODO: 使用 yield 生成前 n 个数
    return

n = int(input())
print(" ".join(str(x) for x in fibonacci(n)))`,
        `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

n = int(input())
print(" ".join(str(x) for x in fibonacci(n)))`,
      ),
    },
    idea:
      '生成器每次 `yield a` 后暂停，调用方取下一个值时才继续。用 `a, b = b, a + b` 同时推进两个状态，不需要保存整个序列。',
    pitfalls: ['用 return 返回列表，失去惰性。', 'n=0 时输出空行。', '循环次数差一。'],
  },
  {
    track: 'python',
    moduleId: 'py-iterators',
    id: 'py-iterators-02',
    slug: 'memo-fib',
    title: '带缓存的斐波那契',
    order: 14,
    difficulty: 'hard',
    scenario: 'algorithm',
    scenarioLabel: '算法竞赛',
    knowledgePoints: ['py-decorators', 'py-functions'],
    prerequisites: ['py-iterators-01'],
    estimatedMinutes: 20,
    summary: '用装饰器实现缓存，避免重复递归计算。',
    statement: {
      scenarioText:
        '直接递归计算斐波那契数列会重复计算大量子问题。请用一个缓存装饰器把复杂度降下来。',
      task: '实现 memoize 装饰器，并计算 fib(n) 对 1,000,000,007 取模的结果。',
      input: '一行一个整数 n。',
      output: '一行一个整数，表示 fib(n) mod 1000000007。',
      constraints: '0 ≤ n ≤ 200。',
    },
    samples: [
      { input: '10\n', output: '55\n' },
      { input: '0\n', output: '0\n' },
    ],
    tests: [
      { input: '1\n', output: '1\n' },
      { input: '20\n', output: '6765\n' },
      { input: '50\n', output: '586268941\n' },
      { input: '200\n', output: '349361645\n' },
    ],
    hints: ['装饰器接收 fn，返回 wrapper。', '用字典缓存参数和结果。', '每次结果取模，避免大整数。'],
    languages: {
      python: python(
        `def memoize(fn):
    # TODO: 返回带缓存的 wrapper
    return fn

@memoize
def fib(n):
    if n < 2:
        return n
    return (fib(n - 1) + fib(n - 2)) % 1000000007

n = int(input())
print(fib(n))`,
        `def memoize(fn):
    cache = {}

    def wrapper(n):
        if n not in cache:
            cache[n] = fn(n)
        return cache[n]

    return wrapper

@memoize
def fib(n):
    if n < 2:
        return n
    return (fib(n - 1) + fib(n - 2)) % 1000000007

n = int(input())
print(fib(n))`,
      ),
    },
    idea:
      'memoize 用闭包保存 cache，wrapper 在调用原函数前先查缓存。fib 每次结果取模，递归树被剪成线性。',
    pitfalls: ['没有保存缓存，装饰器无效。', '取模位置错误。', '递归深度超过限制（n 很大时改用迭代）。'],
  },
  {
    track: 'python',
    moduleId: 'py-stdlib',
    id: 'py-stdlib-01',
    slug: 'extension-stats',
    title: '文件扩展名统计',
    order: 15,
    difficulty: 'medium',
    scenario: 'system',
    scenarioLabel: '系统工具',
    knowledgePoints: ['py-stdlib', 'py-files'],
    prerequisites: ['py-text-02'],
    estimatedMinutes: 15,
    summary: '用 pathlib 提取扩展名并统计数量。',
    statement: {
      scenarioText:
        '整理下载文件夹时，你想知道每种文件类型各有多少个。请写一个统计脚本。',
      task: '统计每个扩展名的文件数量；没有扩展名的归为 none。按扩展名字典序输出。',
      input: '第一行 n。第二行 n 个文件名，不含空格。',
      output: '每行 `ext count`，按 ext 字典序升序。',
      constraints: '1 ≤ n ≤ 100000，文件名长度不超过 100。',
    },
    samples: [
      {
        input: '5\na.txt b.py c.txt d E.md\n',
        output: '.md 1\n.py 1\n.txt 2\nnone 1\n',
        explanation: '.md、.txt 按字典序；d 没有扩展名。',
      },
    ],
    tests: [
      { input: '3\nx.tar.gz\ny.gz\nz.zip\n', output: '.gz 2\n.zip 1\n' },
      { input: '1\nREADME\n', output: 'none 1\n' },
      { input: '2\na.PDF\nb.pdf\n', output: '.PDF 1\n.pdf 1\n' },
    ],
    hints: ['用 pathlib.Path(name).suffix。', 'suffix 为空时记为 none。', '用 dict 计数后排序。'],
    languages: {
      python: python(
        `from pathlib import Path

n = int(input())
names = []
counts = {}
# TODO: 读取 n 个文件名并统计扩展名
for ext, count in sorted(counts.items()):
    print(ext, count)`,
        `import sys
from pathlib import Path

n = int(sys.stdin.readline())
names = sys.stdin.read().split()

counts = {}
for name in names:
    ext = Path(name).suffix or "none"
    counts[ext] = counts.get(ext, 0) + 1
for ext, count in sorted(counts.items()):
    print(ext, count)`,
      ),
    },
    idea:
      '`Path(name).suffix` 返回最后一个扩展名（包含点），没有扩展名时返回空字符串。用 `or "none"` 统一成可读的标签，再按 key 排序输出。',
    pitfalls: ['用 split(".") 把文件名中的多个点处理错。', '扩展名大小写被错误统一。'],
  },
  {
    track: 'python',
    moduleId: 'py-data',
    id: 'py-data-01',
    slug: 'sales-report',
    title: '销售报表',
    order: 16,
    difficulty: 'hard',
    scenario: 'data',
    scenarioLabel: '数据分析',
    knowledgePoints: ['py-data', 'py-dict'],
    prerequisites: ['py-stdlib-01'],
    estimatedMinutes: 22,
    summary: '按商品聚合销售额，并按金额降序、名称升序输出。',
    statement: {
      scenarioText:
        '门店导出了一些销售流水，每行是一条商品销售记录。店长想要一份按商品汇总的销售额报表。',
      task: '按商品汇总金额，按总金额降序输出；金额相同按商品名升序。',
      input: '第一行 n。接下来 n 行，每行 `product amount`。',
      output: '每行 `product total`，按规则排序。',
      constraints: '1 ≤ n ≤ 100000，1 ≤ amount ≤ 10^6，商品名不含空格。',
    },
    samples: [
      {
        input: '5\napple 10\nbanana 20\napple 5\ncherry 20\nbanana 1\n',
        output: 'banana 21\ncherry 20\napple 15\n',
        explanation: 'banana 21、cherry 20、apple 15，按金额降序排列。',
      },
    ],
    tests: [
      {
        input: '3\na 10\nb 10\nc 10\n',
        output: 'a 10\nb 10\nc 10\n',
      },
      {
        input: '4\nx 5\nx 5\ny 9\nz 1\n',
        output: 'x 10\ny 9\nz 1\n',
      },
      {
        input: '2\nb 100\na 100\n',
        output: 'a 100\nb 100\n',
      },
    ],
    hints: ['用 dict 累加每个商品的金额。', '排序 key 写成 (-total, product)。', '金额相同时按商品名字典序。'],
    languages: {
      python: python(
        `n = int(input())
totals = {}
# TODO: 读取并聚合
for product, total in sorted(totals.items(), key=lambda item: (-item[1], item[0])):
    print(product, total)`,
        `n = int(input())
totals = {}
for _ in range(n):
    product, amount = input().split()
    totals[product] = totals.get(product, 0) + int(amount)
for product, total in sorted(totals.items(), key=lambda item: (-item[1], item[0])):
    print(product, total)`,
      ),
    },
    idea:
      '用字典按商品累计金额。排序时用 `(-total, product)` 一次表达“金额降序、名称升序”。',
    pitfalls: ['只按金额排序，金额相同时顺序不稳定。', '忘记把 amount 转成 int。'],
  },
];

export async function seedPythonProblems() {
  for (const problem of problems) {
    await writeProblem(problem);
  }
  console.log(`python problems generated: ${problems.length}`);
}
