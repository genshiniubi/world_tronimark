n = int(input())
scores = list(map(int, input().split()))

average = sum(scores) / n
maximum = max(scores)
minimum = min(scores)
pass_count = sum(1 for score in scores if score >= 60)
print(f"{average:.2f} {maximum} {minimum} {pass_count}")
