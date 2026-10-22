n = int(input())
totals = {}
# TODO: 读取并聚合
for product, total in sorted(totals.items(), key=lambda item: (-item[1], item[0])):
    print(product, total)
