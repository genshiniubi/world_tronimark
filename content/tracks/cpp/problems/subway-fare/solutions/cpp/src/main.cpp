#include <bits/stdc++.h>
using namespace std;

int main() {
    int distance;
    cin >> distance;
    int fare;
    if (distance <= 6) fare = 3;
    else if (distance <= 12) fare = 4;
    else if (distance <= 22) fare = 5;
    else fare = 6;
    cout << fare << '\n';
    return 0;
}
