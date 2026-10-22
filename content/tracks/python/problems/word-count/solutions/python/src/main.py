n = int(input())
words = input().split()

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
top_word = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]
print(len(counts), top_word)
