n = int(input())
totals = {}
for _ in range(n):
    product, amount = input().split()
    totals[product] = totals.get(product, 0) + int(amount)
for product, total in sorted(totals.items(), key=lambda item: (-item[1], item[0])):
    print(product, total)
