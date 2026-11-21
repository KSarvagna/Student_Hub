# Student Hub: Personalized Government Schemes Portal for Students

## Current expansion direction

Student Hub's primary purpose is Indian Government scholarship discovery for students from Class 1 onwards. The intended education scope is school (Classes 1–12), diploma, undergraduate, postgraduate, and research study. The planned government catalogue covers Central and State Government scholarships across every State and Union Territory. Private scholarships are outside the main catalogue; internships and other student benefits are secondary. The first expansion batch is limited to six Central Government scholarship records. Each record must state its supported education level(s) explicitly; do not infer that a scholarship supports every level. Existing records and IDs, especially `pm-usp-csss`, must be preserved. Demo, simplified, and unverified content must be labelled clearly.

The original MVP requirements below describe the starting prototype. Where they conflict with this expansion direction, this section defines the current scope.

**Hackathon track:** Track 1, Civic Pulse, Digital Governance & Public Information
**Builder:** one person (solo), about 3 days
**One-liner:** A students-only website where the student enters a short profile once, and every page (scholarships, schemes, internships, what's new) shows only what applies to them, with clear reasons.

> **Instructions for the coding assistant (read first)**
> 1. Build exactly what this spec says. Do not add features that are not listed.
> 2. **Never invent real schemes, rules, amounts, deadlines, URLs or helpline numbers.** Use the placeholder data described in section 6, and mark every placeholder with `TODO(VERIFY)`. The owner will replace them with verified data.
> 3. Keep the code simple and readable. The owner must be able to explain every file in a demo.
> 4. Write the eligibility engine as plain, pure functions with unit tests (section 7).
> 5. The app must work with no backend and no API key at demo time. All AI-written text is pre-generated and stored as JSON.

---

## 1. Problem

Government help for students (scholarships, schemes, internships, announcements) is spread across many sites, written in formal language, and not filtered for the person reading it. Students don't know what they qualify for, what is new, or what they are missing.

## 2. Solution

A single website for students:

- The student fills in a short profile once.
- Every tab shows only the items relevant to that profile.
- Each item shows a clear result: **Eligible**, **Almost eligible** (and exactly what is missing), or **Not eligible**, with the reasons.
- A "What's new" tab shows recent announcements in plain language, each linked to its official source.
- Every card shows its official source link and a "last verified" date.

## 3. Track fit

| Track 1 goal | How this meets it |
|---|---|
| Public information easier to find | One student-specific entry point, filtered by profile |
| Government services easier to use | Eligibility check with reasons, document checklists, deadlines |
| Policies easier to understand | Plain-language summaries of announcements and schemes |

## 4. Goals and non-goals

### Goals (MVP)
- Profile form saved in the browser
- Deterministic eligibility engine with "almost eligible" logic
- Tabs: Home, For You, Scholarships & Schemes, Internships, What's New, My Plan
- Deadline countdowns
- Source link and last-verified date on every card
- Demo profile switcher (3 sample students)
- Mobile-first, accessible, polished UI

### Non-goals (do not build)
- User accounts, login, or a backend database
- Scraping websites
- Live calls to any AI API
- Submitting applications on the student's behalf
- Any content about harassment, safety incidents, or other sensitive situations

---

## 5. Tech stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Language | JavaScript (JSX), no TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| State | React state + Context for the profile |
| Persistence | `localStorage` (profile and saved items) |
| Data | Static JSON files in `src/data/` |
| Tests | Vitest (engine only) |
| Hosting | Vercel or Netlify (static) |

---

## 6. Data

All data lives in `src/data/`. Placeholder entries must have `"verified": false` and a `TODO(VERIFY)` note. The UI shows a visible **"Sample data, not verified"** badge on any item where `verified` is `false`.

### 6.1 `profile` (stored in localStorage key `studentHub.profile`)

| Field | Type | Allowed values |
|---|---|---|
| `name` | string | free text |
| `course_level` | string | `school`, `diploma`, `undergraduate`, `postgraduate`, `phd`, `research` |
| `school_class` | number | 1 to 12, when applicable |
| `school_type` | string | `government`, `government_aided`, `local_body`, `other` |
| `stream` | string | `engineering`, `medical`, `arts`, `science`, `commerce`, `law`, `other` |
| `year_of_study` | number | 1 to 6 |
| `state` | string | Indian state or UT name |
| `category` | string | `general`, `obc`, `sc`, `st`, `ews` |
| `gender` | string | `female`, `male`, `other`, `prefer_not_to_say` |
| `annual_family_income` | number | rupees per year |
| `last_exam_percentage` | number | 0 to 100 |

All fields are optional. If a field a rule needs is missing, that rule evaluates to `unknown` (see 7.2).

### 6.2 `schemes.json` (scholarships, schemes and internships in one file)

```json
{
  "id": "example-scholarship-1",
  "type": "scholarship",
  "name": "Example Scholarship (placeholder)",
  "provider": "Example Ministry (placeholder)",
  "summary_plain": "One or two plain-language sentences. TODO(VERIFY)",
  "benefit_text": "TODO(VERIFY)",
  "rules": [
    {
      "id": "r1",
      "field": "annual_family_income",
      "op": "<=",
      "value": 800000,
      "label": "Family income is within the limit",
      "missing_hint": "Your family income is above the limit."
    }
  ],
  "documents": [
    { "name": "Income certificate", "where_to_get": "TODO(VERIFY)" }
  ],
  "deadline": "2026-12-31",
  "apply_url": "https://example.com/apply",
  "source_url": "https://example.com/official-page",
  "last_verified": "2026-11-19",
  "verified": false
}
```

- `type`: `scholarship`, `scheme`, or `internship`
- `deadline`: ISO date string or `null` (open or rolling)
- `rules`: array, may be empty (then the item is shown to everyone as eligible)
- `internship` items may also have `duration`, `location`, and `stipend_text` (strings, `TODO(VERIFY)`)

Create **6 placeholder items**: 3 scholarships, 1 scheme, 2 internships. Use clearly fake names and `example.com` URLs. Include rules that exercise different fields (income, category, course level, state, gender, percentage) so the demo profiles produce different results.

### 6.3 `announcements.json`

```json
{
  "id": "example-news-1",
  "title": "Example announcement (placeholder)",
  "date": "2026-11-18",
  "source_name": "Example source",
  "source_url": "https://example.com/press-release",
  "summary_plain": "Plain-language summary. TODO(VERIFY)",
  "who_for": "TODO(VERIFY)",
  "deadline": null,
  "next_step": "TODO(VERIFY)",
  "last_verified": "2026-11-19",
  "verified": false
}
```

Create **4 placeholder announcements**. The summaries will be pre-generated by the owner and pasted in. No runtime AI calls.

### 6.4 `demoProfiles.json`

Three sample students, chosen so the same schemes give different results:

1. First-year undergraduate, engineering, low income, SC category
2. Final-year undergraduate, arts, middle income, female, general category
3. Postgraduate, science, higher income, general category

---

## 7. Eligibility engine

File: `src/engine/eligibility.js`. Pure functions, no React, no side effects.

### 7.1 Operators

`==`, `!=`, `<`, `<=`, `>`, `>=`, `in`, `not_in`

- For `in` and `not_in`, `value` is an array.
- String comparisons are case-insensitive.

### 7.2 Rule evaluation

`evaluateRule(rule, profile)` returns one of:

- `"pass"`: the profile value satisfies the rule
- `"fail"`: the profile value does not satisfy the rule
- `"unknown"`: the profile field is missing or empty

### 7.3 Scheme evaluation

`evaluateScheme(scheme, profile)` returns:

```js
{
  status: "eligible" | "almost" | "not_eligible" | "needs_info",
  passed: [rule, ...],
  failed: [rule, ...],
  unknown: [rule, ...]
}
```

Status logic, in this order:
1. If `unknown.length > 0` and `failed.length === 0` → `needs_info`
2. If `failed.length === 0` and `unknown.length === 0` → `eligible`
3. If `failed.length === 1` → `almost` (the single failed rule's `missing_hint` is shown)
4. Otherwise → `not_eligible`

Items with no rules are `eligible`.

### 7.4 Helpers

- `daysLeft(deadline, today)` → integer, `null` if no deadline, negative if passed
- `deadlineBucket(daysLeft)` → `"open"`, `"soon"` (8 to 30 days), `"urgent"` (0 to 7 days), `"closed"` (negative)
- `rankItems(results)` → sort order: eligible first, then almost, then needs_info, then not_eligible; within a group, soonest deadline first

### 7.5 Unit tests (`src/engine/eligibility.test.js`)

Cover at least:
- each operator passes and fails correctly
- missing profile field gives `unknown`
- all pass gives `eligible`
- exactly one fail gives `almost`
- two or more fails gives `not_eligible`
- no rules gives `eligible`
- `daysLeft` and `deadlineBucket` boundaries (0, 7, 8, 30, negative, `null`)
- sorting order

All tests must pass before the app is considered done.

---

## 8. Pages and routes

| Route | Page | Contents |
|---|---|---|
| `/` | Home | Greeting ("Hi, {name}, what are you looking for today?"), profile form (or summary if filled in), shortcut cards to each tab, short "what's new" preview |
| `/for-you` | For You | All items ranked by `rankItems`, with filter chips (All, Eligible, Almost, Scholarships, Schemes, Internships) |
| `/scholarships` | Scholarships & Schemes | Items of type `scholarship` and `scheme`, with results |
| `/internships` | Internships | Items of type `internship`, filter by location text if present |
| `/whats-new` | What's New | Announcement cards, newest first |
| `/my-plan` | My Plan | Saved items sorted by deadline, document checklist with tick boxes, "Print / save as PDF" button (use `window.print()` with a print stylesheet) |

If no profile exists, the For You, Scholarships, and Internships pages show the profile prompt first.

### Navigation
- Top bar (desktop) and bottom tab bar (mobile) with: Home, For You, Scholarships, Internships, What's New, My Plan
- A "Demo profiles" menu in the header that loads one of the three sample students instantly (clearly labelled as demo)

---

## 9. Components

- `ProfileForm`: all profile fields, validation, saves to localStorage
- `ProfileSummary`: compact view of the saved profile with an Edit button
- `ItemCard`: name, provider, type badge, status badge, deadline chip, plain-language summary, "Why" section, Save button, Source link, last-verified date, "Sample data" badge if unverified
- `ReasonList`: lists rules with ✓ (passed), ✗ (failed), and ? (unknown), using each rule's `label`
- `AlmostBanner`: shown on `almost` cards with the failed rule's `missing_hint`
- `DeadlineChip`: shows "X days left" with bucket styling plus text (never colour alone)
- `DocumentChecklist`: documents for a saved item with checkboxes
- `AnnouncementCard`: title, date, who it is for, summary, deadline, next step, source link, last-verified date
- `StatusBadge`: Eligible, Almost eligible, Not eligible, Needs more info
- `EmptyState`: friendly message and next step when nothing matches
- `DemoProfileMenu`
- `Disclaimer` (footer, every page): "Guidance only. Always confirm details on the official page before applying."

---

## 10. UI and UX requirements

- Mobile-first; test at 375 px width and desktop
- Clean, calm style; readable fonts; one accent colour
- Status and deadline never rely on colour alone (include text or icons)
- All form fields have labels; focus states visible; tap targets at least 44 px
- Plain language everywhere; avoid jargon, or explain it in a tooltip
- Light mode is enough; dark mode is optional
- No layout shift when switching demo profiles
- Print stylesheet for My Plan

---

## 11. Project structure

```
student-hub/
  src/
    main.jsx
    App.jsx
    context/ProfileContext.jsx
    data/
      schemes.json
      announcements.json
      demoProfiles.json
    engine/
      eligibility.js
      eligibility.test.js
    components/   (components listed in section 9)
    pages/
      Home.jsx
      ForYou.jsx
      Scholarships.jsx
      Internships.jsx
      WhatsNew.jsx
      MyPlan.jsx
    utils/storage.js    (safe localStorage read/write with try/catch)
  index.html
  package.json
  README.md
```

`README.md` must explain: how to run, how to add a scheme (the JSON format), how to mark an item as verified, and how to run the tests.

---

## 12. Build order

1. Scaffold the project (Vite, React, Tailwind, Router, Vitest)
2. Write the data schemas and placeholder JSON files
3. Write the eligibility engine and its tests; make them pass
4. Profile context, storage helpers, and `ProfileForm`
5. `ItemCard`, `ReasonList`, `StatusBadge`, `DeadlineChip`, `AlmostBanner`
6. For You, Scholarships, and Internships pages
7. What's New page and `AnnouncementCard`
8. Save to My Plan, `DocumentChecklist`, My Plan page, print stylesheet
9. Demo profile menu and sample profiles
10. Home page, navigation, footer disclaimer, empty states
11. Mobile and accessibility pass; README

---

## 13. Acceptance criteria

- [ ] Entering a profile once changes the results on every tab
- [ ] Switching between the 3 demo profiles visibly changes the results
- [ ] Every card shows reasons (✓ / ✗ / ?), a source link, and a last-verified date
- [ ] Items with exactly one failed rule show as "Almost eligible" with the missing item named
- [ ] Deadline chips show the correct number of days and bucket
- [ ] Saved items persist after a page refresh
- [ ] My Plan sorts by deadline and can be printed or saved as PDF
- [ ] Unverified items show a "Sample data" badge
- [ ] All unit tests pass
- [ ] App works offline after loading (no API calls needed)
- [ ] No console errors; usable at 375 px width

---

## 14. Owner's tasks (not for the coding assistant)

- Choose 10 to 12 real items and **verify every rule, amount, deadline and URL against the official source**
- Replace placeholder data and set `verified: true` with a real `last_verified` date
- Write the plain-language summaries (using any AI tool) and paste them into the JSON
- Confirm with the organizers that Track 1 accepts ideas outside the listed examples
- Check the real submission deadline (assumed Nov 22)
- Prepare the demo: same site, three profiles, results change on screen

---

## 15. Stretch features (only after all acceptance criteria pass)

1. **Guided "I have a problem" flow** for non-sensitive student issues (scholarship not received, fee refund, certificate delay, attendance issue). Rule-based topic picker (no AI) leading to steps, documents, the official portal link, and a copyable draft email template.
2. **Calendar export** (`.ics` file) of saved deadlines
3. **Language toggle** (English, Hindi, Telugu) for labels and card summaries, with translations supplied by the owner
4. **"What am I missing?" view** listing the failed rules that appear most often across items
5. **Dark mode**

---

## 16. Demo plan (about 3 minutes)

1. **Hook (20s):** "A student shouldn't have to check five websites to find what they're entitled to."
2. **Profile 1 (50s):** Load demo student 1; show For You, one Eligible card with reasons, and one Almost-eligible card with the missing item.
3. **Switch profile (40s):** Load demo student 3; show the same site giving different results.
4. **What's New (25s):** Open an announcement with its plain-language summary and source link.
5. **My Plan (25s):** Save two items, show the deadline order and document checklist.
6. **Close (20s):** Honest scope ("a verified starter set"), then the roadmap.

---

## 17. Risks

| Risk | Mitigation |
|---|---|
| Looks like a plain directory | Lead the demo with the personalization and the reasons |
| Wrong or outdated data | Verified starter set only, with source and last-verified date on every card |
| Overclaiming coverage | Say "starter set of N verified items" |
| Scope creep | Do not start stretch features until all acceptance criteria pass |
| Live-demo failure | No runtime API calls; everything is static |
