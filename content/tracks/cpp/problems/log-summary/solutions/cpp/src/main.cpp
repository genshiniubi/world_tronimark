#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    int errors = 0, warns = 0, infos = 0;
    for (int i = 0; i < n; ++i) {
        string line;
        getline(cin, line);
        stringstream ss(line);
        string level;
        ss >> level;
        if (level == "ERROR") ++errors;
        else if (level == "WARN") ++warns;
        else if (level == "INFO") ++infos;
    }
    cout << "ERROR " << errors << '\n';
    cout << "WARN " << warns << '\n';
    cout << "INFO " << infos << '\n';
    return 0;
}
