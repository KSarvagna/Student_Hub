# Student Hub

Student Hub helps students discover Government scholarships and related opportunities, understand how listed rules compare with their profile, and keep a personal application plan.

## Project scope

- Central Government scholarship opportunities across India.
- Telangana State Government scholarships only.
- Students from Class 1 onwards across school, diploma, undergraduate, postgraduate and research levels.
- Private scholarships are outside the main catalogue.

The current catalogue contains 6 Central Government records, 5 Telangana Government records, and 6 legacy placeholder examples. The placeholder examples remain unclassified and visibly marked. Some real listings also use simplified eligibility checks or need current-cycle confirmation. Always confirm eligibility, award terms, documents, deadlines and application steps on the official source.

## Features

- Personalized eligibility checks with passed, unmet and unanswered rules.
- Search by opportunity, provider and keyword; filter by government level, education level and application status; sort by deadline.
- Clearly labeled government level, verification and application status.
- Save opportunities to My Plan, track listed documents and export dated deadlines to a calendar file.
- Fictional demo profiles for a quick presentation path.
- Browser-local profile, saved-item and checklist storage. No account is required.

## Technology

- React, JavaScript and Vite
- React Router
- Tailwind CSS
- Browser `localStorage`
- Vitest

## Run locally

Install Node.js and npm, then run these commands from the project folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run quality checks with:

```sh
npm test
npm run build
```

The production build is written to `dist/`.

## Two-minute demo

1. Open Home and point out the Central, Telangana and sample catalogue counts.
2. Choose **Fictional CSSS Demo Student** in the Demo profiles menu.
3. Open **For You** and show PM-USP CSSS with its eligibility result and reasons.
4. Switch to **Demo Student One** to show missing CSSS criteria, then restore the fictional CSSS profile.
5. Open **Scholarships**, search for “ePASS”, and filter by Telangana Government or education level.
6. Save a Telangana Post-Matric or PM-USP opportunity and open **My Plan**.
7. Show the deadline and use **Export deadlines to calendar**.

## Current limitations

- This is a static, browser-only application. It does not submit applications, scrape live portals, or provide user accounts or cloud sync.
- The catalogue is a focused starter set, not a complete inventory of every Central or Telangana Government scholarship.
- Eligibility results only evaluate the rules represented in each record. Simplified or partially verified items are labeled; the result is guidance, not an official decision.
- Some state-program criteria vary by community, course, location or current Government Order and need confirmation on ePASS.
- Profile, saved opportunities and checklist progress remain in the current browser and can be cleared by the user.
