#include <bits/stdc++.h>
using namespace std;

class Library {
public:
    void addBook(int id, int copies) {
        copies_[id] += copies;
    }

    bool borrow(int id) {
        auto it = copies_.find(id);
        if (it == copies_.end() || it->second <= 0) return false;
        --it->second;
        return true;
    }

    bool giveBack(int id) {
        auto it = copies_.find(id);
        if (it == copies_.end()) return false;
        ++it->second;
        return true;
    }

private:
    map<int, int> copies_;
};

int main() {
    int n;
    cin >> n;
    Library library;
    for (int i = 0; i < n; ++i) {
        int id, copies;
        cin >> id >> copies;
        library.addBook(id, copies);
    }
    int m;
    cin >> m;
    while (m--) {
        string op;
        int id;
        cin >> op >> id;
        if (op == "BORROW") cout << (library.borrow(id) ? "OK" : "NO") << '\n';
        else cout << (library.giveBack(id) ? "OK" : "NO") << '\n';
    }
    return 0;
}
