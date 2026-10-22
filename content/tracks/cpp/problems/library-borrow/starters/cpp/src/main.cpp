#include <bits/stdc++.h>
using namespace std;

class Library {
public:
    void addBook(int id, int copies) {
        // TODO
    }

    bool borrow(int id) {
        // TODO
        return false;
    }

    bool giveBack(int id) {
        // TODO
        return false;
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
