a, b = input().split()

try:
    result = float(a) / float(b)
except (ValueError, ZeroDivisionError):
    print("ERROR")
else:
    print(f"{result:.2f}")
