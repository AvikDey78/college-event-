# EventPulse: College Event Management Website
**Name:** Avik Dey **Roll no.:** 68 **Course:** IT Workshop (PCCCS382)

## 1. Objective
Build a responsive College Event Management website using only HTML5, CSS3 and JavaScript, with Home, Events, Registration, Gallery, About us and Contact sections.

## 2. Folder structure
`index.html` · `css/style.css` · `js/script.js` · `images/` · `screenshots/` · `README.md` · `REPORT.md`

## 3. Sections
- **Home:** logo, sticky navigation, introduction, next-event countdown card, live counts.
- **Events:** six events (name, date, venue, category, description) built from one JavaScript array.
- **Registration:** name, roll no., department, email, phone, gender, event, all validated.
- **Gallery:** six images in a CSS Grid with zoom and caption-slide hover effects.
- **About us:** department paragraph and a team list (`<dl>`).
- **Contact:** address, email, phone, office hours and a validated feedback form.

## 4. JavaScript features (brief needs two; seven built)
1. Events rendered from an array, with category filter chips and live search
2. Countdown to the next upcoming event (updates every second)
3. Digital clock in IST
4. Dark / light mode, remembered with localStorage
5. Registration validation using regular expressions (name, roll, email, phone), inline errors, live re-check, and a saved "your registrations" list
6. Feedback form validation (message of at least 15 characters)
7. Mobile hamburger menu and highlight of the section in view

## 5. Responsive approach
Fluid layout with CSS Grid/Flexbox, `clamp()` type sizes and the viewport meta tag. Breakpoints at 900 px (single column, 2-column gallery) and 680 px (hamburger menu, 1-column layout). Colours: indigo and lime; fonts: Space Grotesk + Inter.

## 6. Testing
Tested in Chromium at 1366, 820 and 390 px widths: no horizontal scroll, no console errors. Checked an empty submit (7 errors shown), a bad phone number, a valid registration, filter and search (including the no-results message), short feedback message, dark mode and the mobile menu.

## 7. Limitations
Registrations are stored only in the browser (no server or database). Gallery images are illustrations to be replaced with real event photos. Contact details are placeholders.
