def split_bill(total, people, tip_percent=0):
    return total * (1 + tip_percent / 100) / people

total, people, tip_percent = input().split()
total = float(total)
people = int(people)
tip_percent = float(tip_percent)
print(f"{split_bill(total, people, tip_percent):.2f}")
