n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]
intervals.sort(key=lambda x: x[1])

count = 0
last_end = -1
for start, end in intervals:
    if start >= last_end:
        count += 1
        last_end = end
print(count)
