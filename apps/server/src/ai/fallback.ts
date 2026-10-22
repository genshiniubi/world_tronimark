import type {
  AiCompletionItem,
  AiExplainResponse,
  AiReview,
  Language,
  ProblemSummary,
} from '@codelab/shared';

const KEYWORDS: Record<Language, string[]> = {
  cpp: [
    'include',
    'iostream',
    'vector',
    'string',
    'unordered_map',
    'map',
    'set',
    'queue',
    'stack',
    'priority_queue',
    'algorithm',
    'sort',
    'reverse',
    'max',
    'min',
    'abs',
    'long long',
    'const',
    'auto',
    'for',
    'while',
    'if',
    'else',
    'return',
    'struct',
    'class',
    'public',
    'private',
    'template',
    'typename',
    'nullptr',
    'true',
    'false',
  ],
  python: [
    'def',
    'return',
    'if',
    'elif',
    'else',
    'for',
    'while',
    'in',
    'range',
    'len',
    'enumerate',
    'zip',
    'sorted',
    'list',
    'dict',
    'set',
    'tuple',
    'str',
    'int',
    'float',
    'open',
    'with',
    'as',
    'try',
    'except',
    'finally',
    'class',
    'self',
    'lambda',
    'yield',
    'import',
    'from',
    'None',
    'True',
    'False',
  ],
};

const SNIPPETS: Record<Language, Array<{ label: string; detail: string; insertText: string }>> = {
  cpp: [
    {
      label: 'for-i',
      detail: '标准下标循环',
      insertText: 'for (int i = 0; i < n; ++i) {\n    \n}',
    },
    {
      label: 'for-range',
      detail: '范围 for 循环',
      insertText: 'for (const auto& item : items) {\n    \n}',
    },
    {
      label: 'main',
      detail: 'C++ 主函数',
      insertText: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    \n    return 0;\n}',
    },
    {
      label: 'fast-io',
      detail: '快速输入输出',
      insertText: 'ios::sync_with_stdio(false);\ncin.tie(nullptr);',
    },
    {
      label: 'vector',
      detail: 'vector 声明',
      insertText: 'vector<int> nums(n);',
    },
  ],
  python: [
    {
      label: 'for-range',
      detail: 'range 循环',
      insertText: 'for i in range(n):\n    ',
    },
    {
      label: 'def',
      detail: '函数定义',
      insertText: 'def solve():\n    ',
    },
    {
      label: 'main',
      detail: 'Python 入口',
      insertText: 'if __name__ == "__main__":\n    solve()',
    },
    {
      label: 'read',
      detail: '读取一行',
      insertText: 'line = input().strip()',
    },
    {
      label: 'with-open',
      detail: '安全读取文件',
      insertText: 'with open("input.txt", encoding="utf-8") as f:\n    data = f.read()',
    },
  ],
};

export function localCompletions(
  language: Language,
  code: string,
  cursor: number,
): AiCompletionItem[] {
  const before = code.slice(0, cursor);
  const match = before.match(/[A-Za-z_][A-Za-z0-9_]*$/);
  const prefix = match?.[0] ?? '';
  const identifiers = new Set<string>();
  for (const found of code.matchAll(/[A-Za-z_][A-Za-z0-9_]{2,}/g)) {
    if (found[0] !== prefix) identifiers.add(found[0]);
  }
  const items: AiCompletionItem[] = [];
  if (prefix) {
    for (const keyword of KEYWORDS[language]) {
      if (keyword.startsWith(prefix) && keyword !== prefix) {
        items.push({
          label: keyword,
          insertText: keyword,
          detail: '关键字',
          kind: 'keyword',
          source: 'local',
        });
      }
    }
    for (const identifier of identifiers) {
      if (identifier.startsWith(prefix)) {
        items.push({
          label: identifier,
          insertText: identifier,
          detail: '当前文件中的标识符',
          kind: 'identifier',
          source: 'local',
        });
      }
    }
  }
  for (const snippet of SNIPPETS[language]) {
    if (!prefix || snippet.label.startsWith(prefix)) {
      items.push({
        label: snippet.label,
        insertText: snippet.insertText,
        detail: snippet.detail,
        documentation: snippet.insertText,
        kind: 'snippet',
        source: 'local',
      });
    }
  }
  const seen = new Set<string>();
  return items
    .filter((item) => {
      const key = `${item.label}:${item.insertText}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

function detectTopic(selected: string): {
  meaning: string;
  why: string;
  alternatives: string;
  convenient: string;
} {
  const text = selected.trim();
  if (/\b(if|else|switch)\b/.test(text)) {
    return {
      meaning: '这是一段条件分支代码，根据条件是否成立选择不同的执行路径。',
      why: '这样写把不同情况拆开，便于分别处理边界情况和正常情况。',
      alternatives: '简单的二选一可以用三目运算符；分支很多时可以用 switch 或查表。',
      convenient: '把复杂条件提取成有名字的布尔变量，例如 `bool valid = ...`，可读性会更好。',
    };
  }
  if (/\b(for|while)\b/.test(text)) {
    return {
      meaning: '这是一段循环代码，用来重复处理一组数据或推进某个状态。',
      why: '循环把重复逻辑集中起来，避免复制粘贴，也方便统一处理边界。',
      alternatives: '已知次数用 for；不确定次数用 while；遍历容器可用范围 for / for-each。',
      convenient: '循环变量名写清楚含义，循环体只做一件事，并在循环前处理空数据。',
    };
  }
  if (/\b(vector|list|array|dict|set|map)\b/.test(text)) {
    return {
      meaning: '这里在使用容器保存一组数据，容器负责组织数据并提供查找、遍历等操作。',
      why: '选择合适的容器能让代码更短、更快，也更不容易出现下标越界。',
      alternatives: '需要按下标访问用数组/vector；需要按键查找用 map/unordered_map；需要去重用 set。',
      convenient: '先明确“我要按什么访问数据”，再选容器；遍历时优先使用范围 for。',
    };
  }
  if (/\*|&/.test(text) && /\b(int|char|double|string|auto)\b/.test(text)) {
    return {
      meaning: '这里涉及指针或引用：它们都指向/引用另一块数据，而不是复制一份新值。',
      why: '传引用可以避免复制并允许修改原对象；指针则更灵活，但需要自己保证非空和生命周期。',
      alternatives: '只想读取用 `const T&`；需要修改用 `T&`；需要表示“可能没有”再用指针或 optional。',
      convenient: '现代 C++ 优先用引用表达“一定存在”，少用裸指针管理资源，资源交给 RAII。',
    };
  }
  if (/\b(class|struct|public|private)\b/.test(text)) {
    return {
      meaning: '这里在定义或使用一个自定义类型，把数据和操作封装在一起。',
      why: '封装能隐藏实现细节，让调用方只依赖稳定的接口。',
      alternatives: '只聚合数据可以用 struct；需要维护不变量时用 class，并把成员设为 private。',
      convenient: '先写清构造函数和公开方法，再补内部实现；保持一个类只负责一件事。',
    };
  }
  if (/\b(def|lambda|return)\b/.test(text)) {
    return {
      meaning: '这里在定义函数或返回结果，把一段逻辑包装成可复用的单元。',
      why: '函数让复杂问题可以被拆成小块，也方便单独测试。',
      alternatives: '简单的一次性逻辑可以用 lambda；需要复用时定义具名函数。',
      convenient: '函数名用动词，参数不要太多；返回值类型和边界条件写清楚。',
    };
  }
  return {
    meaning: '这段代码是当前解题过程的一部分。选中它通常说明你想确认它的作用或写法。',
    why: '把代码写成小块、让每一步都有明确目的，是减少 bug 的关键。',
    alternatives: '可以尝试把这段逻辑提取成函数，或换一种数据结构来简化操作。',
    convenient: '先写清输入、输出和边界，再写实现；命名要表达意图，避免过长的表达式。',
  };
}

export function fallbackExplain(
  language: Language,
  selectedText: string,
  question?: string,
): AiExplainResponse {
  const topic = detectTopic(selectedText);
  const languageName = language === 'cpp' ? 'C++' : 'Python';
  const answer = question
    ? `当前未配置 AI Key，无法进行真正的语义问答。就你选中的 ${languageName} 代码而言，建议先确认：这段代码的输入是什么、输出了什么、边界条件是否覆盖。配置 AI 后，我才能结合完整上下文回答“${question}”。`
    : undefined;
  return {
    ...topic,
    answer,
    degraded: true,
  };
}

export function fallbackReview(input: {
  verdict: string;
  passed: number;
  total: number;
  compileOutput: string;
  attempts: number;
  similar: ProblemSummary[];
}): AiReview {
  const passed = input.verdict === 'AC';
  const strengths: string[] = [];
  const issues: string[] = [];
  const suggestions: string[] = [];
  if (passed) {
    strengths.push(`通过了 ${input.total} 个测试用例。`);
    strengths.push('代码可以编译并稳定运行，说明主流程是正确的。');
    suggestions.push('尝试分析时间复杂度和空间复杂度，看看是否还有优化空间。');
    suggestions.push('补一组自己的边界用例，例如空输入、单元素、最大值。');
  } else {
    if (input.verdict === 'CE') {
      issues.push('当前代码没有通过编译，先根据编译信息修复语法或类型问题。');
    } else if (input.verdict === 'TLE') {
      issues.push('程序超时，检查是否存在重复计算或过高的时间复杂度。');
      suggestions.push('尝试用哈希表、排序、二分或前缀和降低复杂度。');
    } else if (input.verdict === 'WA') {
      issues.push(`只通过了 ${input.passed}/${input.total} 个测试，说明某些边界或逻辑还不完整。`);
      suggestions.push('用样例逐步手算，重点检查循环边界、初始值和特殊输入。');
    } else {
      issues.push('程序运行时出错，检查数组越界、空指针、除零或输入格式。');
    }
    suggestions.push('把失败用例的输入抄下来，手动模拟一遍变量变化。');
    if (input.attempts > 1) {
      strengths.push(`已经尝试了 ${input.attempts} 次，持续迭代是很好的学习过程。`);
    }
  }
  if (input.compileOutput.trim()) {
    issues.push('编译输出里有诊断信息，建议逐条阅读并定位到对应行。');
  }
  return {
    passed,
    headline: passed ? '判题通过，继续保持' : '这次还没有通过，先定位第一个失败点',
    strengths,
    issues,
    suggestions,
    complexity: '尝试用 O(n)、O(n log n)、O(n²) 等量级描述你的做法，并说明额外空间。',
    processNote:
      input.attempts > 1
        ? `你在这道题上提交了 ${input.attempts} 次，建议回看每次修改的原因。`
        : '这是这道题的第一次提交，建议把思路用自己的话记到笔记里。',
    similarProblemIds: input.similar.map((item) => item.id),
    degraded: true,
  };
}
