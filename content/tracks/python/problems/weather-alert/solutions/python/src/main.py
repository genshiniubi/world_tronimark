temperature, wind = map(int, input().split())

if temperature >= 35 or wind >= 10:
    print("RED")
elif temperature >= 30 or wind >= 7:
    print("ORANGE")
elif temperature >= 25:
    print("YELLOW")
else:
    print("GREEN")
