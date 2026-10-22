n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]
intervals.sort(key=lambda x: x[1])

count = 0
last_end = -1
# TODO: 贪心选择区间
print(count)
