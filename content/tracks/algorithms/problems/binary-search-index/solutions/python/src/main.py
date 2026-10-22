n, q = map(int, input().split())
a = list(map(int, input().split()))
queries = list(map(int, input().split()))

for target in queries:
    left, right = 0, n - 1
    answer = -1
    while left <= right:
        mid = left + (right - left) // 2
        if a[mid] >= target:
            if a[mid] == target:
                answer = mid
            right = mid - 1
        else:
            left = mid + 1
    print(answer)
