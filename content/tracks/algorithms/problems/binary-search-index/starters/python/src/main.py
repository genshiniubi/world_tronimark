n, q = map(int, input().split())
a = list(map(int, input().split()))
queries = list(map(int, input().split()))

for target in queries:
    left, right = 0, n - 1
    answer = -1
    # TODO: 二分查找最左下标
    print(answer)
