n, k = map(int, input().split())
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
print(answer)
