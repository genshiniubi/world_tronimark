n, capacity = map(int, input().split())
dp = [0] * (capacity + 1)
for _ in range(n):
    weight, value = map(int, input().split())
    for c in range(capacity, weight - 1, -1):
        dp[c] = max(dp[c], dp[c - weight] + value)
print(dp[capacity])
