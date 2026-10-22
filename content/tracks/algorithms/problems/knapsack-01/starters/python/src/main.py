n, capacity = map(int, input().split())
dp = [0] * (capacity + 1)
for _ in range(n):
    weight, value = map(int, input().split())
    # TODO: 0/1 背包转移
print(dp[capacity])
