import sys

n = int(sys.stdin.readline())
errors = 0
for _ in range(n):
    line = sys.stdin.readline().strip()
    if line.startswith("ERROR"):
        errors += 1
print(errors)
