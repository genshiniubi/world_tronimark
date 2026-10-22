price, count, discount = input().split()
price = float(price)
count = int(count)
discount = int(discount)

subtotal = price * count
total = subtotal * (100 - discount) / 100
print(f"{total:.2f}")
