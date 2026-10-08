# Erick Ochieng Opiyo — Portfolio

A static, 5-page personal portfolio: **Educator. Technologist. Builder.**
Pure HTML, CSS and vanilla JavaScript — no build step, no framework, no backend required.

```
portfolio/
├── index.html        Home
├── about.html        About me, education timeline, interests, "Why I build"
├── projects.html     Filterable project grid (All / Websites / Management Systems / POS)
├── skills.html       Education & professional skills, tech skills, degrees
├── contact.html      Contact details + validated form
├── css/style.css     All styles (colours/fonts in the :root block at the top)
├── js/script.js      Mobile menu, scroll reveal, filtering, form validation
├── images/           Project screenshots, profile photo, social share image
└── assets/           Favicons and assets/cv/Erick-Ochieng-Opiyo-CV.pdf
```

## Run it

Open `index.html` in a browser, or serve the folder (recommended, so downloads behave like production):

```bash
cd portfolio
python3 -m http.server 8000   # then visit http://localhost:8000
```

Deploy by uploading the whole folder to any static host (Hostinger `public_html`, Netlify, GitHub Pages, Vercel).

## Before going live — replace the placeholders

Search the project for `[` to find every placeholder.

| Placeholder | Where | What to do |
|---|---|---|
| `[YOUR EMAIL]`, `[YOUR PHONE]`, `[WHATSAPP NUMBER]` | `contact.html` | Replace the text **and** change `href="#"` to `mailto:…`, `tel:+254…`, `https://wa.me/254…`. Delete the `data-placeholder="…"` attribute. |
| `[LINKEDIN URL]`, `[GITHUB URL]` | `contact.html` + footer of every page | Same as above. Social icons in the footer are in all 5 pages. |
| `[YOUR WEBSITE URL]` | `<head>` of every page (`og:url`) | Your live domain, e.g. `https://erickopiyo.com`. Also make `og:image` an absolute URL. |
| `View Project` / `View Code` links | `index.html`, `projects.html` | Point to a live URL, demo or repo; remove `data-placeholder`. For private client systems, remove "View Code" or link a case study. |
| `[Add technologies here]` etc. | `skills.html` | Add confirmed skills; remove unused placeholder rows. |
| `images/profile.jpg` | — | Your photo, portrait ~800×1000 (same file name). |
| `images/*.jpg` project images | — | Real screenshots at 1200×750 (16:10), same file names. Blur any real student/customer data first. |
| `assets/cv/Erick-Ochieng-Opiyo-CV.pdf` | — | Your real CV, same file name. |

> Tip: placeholder links use `href="#" data-placeholder="…"`. Clicking them shows a small "coming soon" message instead of a broken link, so the site is safe to preview before everything is filled in.

## Connect the contact form

The form validates on the client but needs a service to deliver mail. Easiest option, [Formspree](https://formspree.io) (free tier):

1. Create a form and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `contact.html`, set `<form id="contact-form" … data-endpoint="https://formspree.io/f/abcdwxyz">`.

That's it — `script.js` posts the form with `fetch` and shows success/error messages. Because you already run PHP hosting, you could alternatively point `data-endpoint` at your own `send.php` that returns HTTP 200.

## Customising

- **Colours:** edit `--primary`, `--secondary`, `--accent`, `--background`, `--surface`, `--text`, `--muted` at the top of `css/style.css`.
- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (labels) via Google Fonts in each page's `<head>`.
- **Navigation / footer:** shared markup is repeated in all 5 pages (a static site has no includes) — change it in each file.
- **Adding a project:** copy an `<article class="project-card">` block in `projects.html`. Its `data-category` must be `websites`, `systems` or `pos` for the filter to pick it up; also update the count in the filter button.

## Built-in quality

- Responsive and tested at 320, 375, 425, 768, 1024 and 1440 px — no horizontal scrolling.
- Mobile menu: hamburger ⇄ X, closes on link click, outside click and `Esc`; accessible labels swap between "Open/Close navigation menu"; hidden items are removed from tab order.
- Skip link, semantic landmarks, one `h1` per page, visible focus rings, labelled form fields with inline errors.
- Scroll-reveal animations disabled automatically for users with `prefers-reduced-motion`.
- Per-page titles, descriptions, keywords, Open Graph/Twitter tags and favicons.
