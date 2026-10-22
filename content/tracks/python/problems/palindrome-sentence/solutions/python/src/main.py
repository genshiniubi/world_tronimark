line = input()

cleaned = "".join(ch.lower() for ch in line if ch.isalnum())
print("YES" if cleaned == cleaned[::-1] else "NO")
