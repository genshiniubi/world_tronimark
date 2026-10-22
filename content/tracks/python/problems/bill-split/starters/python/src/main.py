def split_bill(total, people, tip_percent=0):
    # TODO: 返回每人应付金额
    return 0.0

total, people, tip_percent = input().split()
total = float(total)
people = int(people)
tip_percent = float(tip_percent)
print(f"{split_bill(total, people, tip_percent):.2f}")
