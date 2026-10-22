n = int(input())
codes = input().split()

valid = 0
for code in codes:
    if len(code) == 6 and code.isdigit():
        valid += 1
print(valid)
