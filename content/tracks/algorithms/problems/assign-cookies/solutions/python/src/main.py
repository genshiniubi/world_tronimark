n, m = map(int, input().split())
greed = sorted(map(int, input().split()))
cookies = sorted(map(int, input().split()))

i = j = 0
while i < n and j < m:
    if cookies[j] >= greed[i]:
        i += 1
    j += 1
print(i)
