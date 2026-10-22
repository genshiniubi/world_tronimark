#include <bits/stdc++.h>
using namespace std;

struct Person {
    string name;
    int age;
};

int main() {
    int n;
    cin >> n;
    vector<Person> people(n);
    for (Person& p : people) cin >> p.name >> p.age;
    // TODO: 按 age 升序、name 升序排序
    for (const Person& p : people) cout << p.name << ' ' << p.age << '\n';
    return 0;
}
