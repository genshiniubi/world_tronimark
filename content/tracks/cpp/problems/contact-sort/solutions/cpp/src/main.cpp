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
    sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        if (a.age != b.age) return a.age < b.age;
        return a.name < b.name;
    });
    for (const Person& p : people) cout << p.name << ' ' << p.age << '\n';
    return 0;
}
