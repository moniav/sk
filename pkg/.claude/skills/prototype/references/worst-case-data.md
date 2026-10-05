# Worst-Case Data

The realistic worst case for every value a flow shows. Demo data is usually picked to make a screen look good: names that fit, counts that need no separator, every optional field filled. This list undoes that, one field at a time.

## Contents

- Rule
- Catalogue
- Using it

## Rule

**Plausible or schema-backed, never random.** Each worst-case value is either something a real user could produce, or the actual limit from the PRD's requirements, the validation schema or the database column. `"aaaaaaaa…"` proves nothing and gets dismissed. If no limit is defined anywhere, that is a finding: record "unbounded" and test something long but believable.

## Catalogue

| Field kind | Worst cases to include |
|------------|------------------------|
| Person name | Long compound name (`Aleksandra Wiśniewska-Kowalczyk`), one-letter or two-letter name (`Jo`), single name with no surname, name with apostrophe (`O'Connor-Ní Bhriain`) |
| Email, URL, ID | Long unbreakable email (`bartholomew.fitzgerald@northwind-industries-holdings.example.com`), long URL with query string, long unbroken token |
| Free text | The longest value the schema accepts; a multi-paragraph value where one line was expected; leading and trailing spaces |
| Counts | 0, exactly 1 (singular wording), 1,284 (needs a separator), the plan limit, the limit plus one |
| Lists | Empty, one item, one more than fits on screen, hundreds (pagination or virtualisation) |
| Optional fields | Every optional field missing at once: no avatar, no description, no due date |
| Money and numbers | Negative, zero, very large (`₪12,450,000.00`), many decimals, other currencies and their symbol position |
| Dates and time | Today, far past, far future, across a time-zone boundary, a date written day-first |
| Direction and script | Hebrew or Arabic text (RTL), mixed RTL text with numbers or English inside, CJK, emoji in names |
| Translated labels | Labels 40% longer than English (German), button text that wraps |
| Status | Every status the data model allows, including the rare ones (suspended, pending deletion, expired) |
| Permissions | The lowest role viewing the same screen; a user removed while the screen is open |
| Slow and failed | A response that takes 8 seconds; a failure halfway through a multi-step action |

## Using it

- Build one worst-case dataset that hits every row that applies to the flow at once, mixed across records as real data is: row 1 has the long name, row 2 the missing avatar, row 3 the RTL text.
- Feed it through the same place the demo data comes from. Never edit the markup to produce a break.
- Report each break with the field, the value, what happened, and a proposed decision. Some breaks are product decisions (truncate or wrap, hide or show "—"): put those to the user and record the answer as an FR.
