# Rahul Palanisamy — Automation QA Portfolio

A single-page, dark, black-and-white portfolio site built for a Senior QA Automation Engineer. Content is pulled directly from the attached résumé — no invented technologies, projects, or metrics.

## Structure

```
Automation-Portfolio/
├── index.html          → all sections/markup
├── style.css           → design tokens, layout, components
├── script.js           → scroll reveals, counters, hero terminal typing effect, mobile nav, form handler
├── assets/
│   ├── resume.pdf       → downloadable résumé (linked from the nav + hero)
│   └── images/          → empty — add a profile photo here if you want one (see below)
└── README.md
```

No build step, no framework, no dependencies beyond three Google Fonts loaded via CDN link tags (Space Grotesk, Inter, JetBrains Mono).

## Run it locally

Just open `index.html` in a browser, or serve it so relative asset paths behave the same as in production:

```bash
cd Automation-Portfolio
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy for free

### GitHub Pages
1. Create a new GitHub repo and push this folder's contents to the root of the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

### Vercel
1. Push this folder to a GitHub repo (same as above).
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and import the repo.
3. Framework preset: choose **Other** (it's static HTML, no build command needed).
4. Click **Deploy** — Vercel gives you a live `https://<project>.vercel.app` URL, and you can attach a custom domain for free.

Either option works well; GitHub Pages is simplest if you just want a link to share with recruiters, Vercel is nicer if you want custom domains or want to iterate quickly with previews per commit.

## Updating your content later

Everything is plain HTML — no CMS, no data files — so updates are direct text edits in `index.html`:

| What to change | Where |
|---|---|
| Name, title, tagline | `<section class="hero">` near the top |
| About paragraphs / stats | `<section id="about">` |
| Skill groups | `<section id="skills">` — one `.skill-card` per group |
| Companies, roles, bullets | `<section id="experience">` — one `.tl-item` per employer |
| Project cards | `<section id="projects">` — one `.project-card` per engagement |
| Framework pipeline steps | `<section id="framework">` — one `.pipe-step` per stage |
| Education | `<section id="education">` |
| Email / phone / location | `<section id="contact">` |

To swap the résumé file: replace `assets/resume.pdf` with your updated PDF, keeping the same filename (or update the two `href="assets/resume.pdf"` links in `index.html` if you rename it).

### Adding a profile photo
The current design intentionally uses a terminal/console visual instead of a photo (no photo was provided in the résumé, and the brief asked not to invent assets). If you'd like to add one:
1. Drop the image into `assets/images/`.
2. In `index.html`, inside `.hero-inner` or next to `.hero-console`, add: `<img src="assets/images/profile-photo.png" alt="Rahul Palanisamy" class="hero-photo">`
3. Add matching styles for `.hero-photo` in `style.css` (a simple `border-radius`, `filter: grayscale(1)` to stay on-theme, and a max-width works well).

### Contact form
The form in `#contact` submits silently in-page via [EmailJS](https://www.emailjs.com) — no page reload, no backend server. It needs three values from your [EmailJS dashboard](https://dashboard.emailjs.com), set near the bottom of `script.js`:

```js
const EMAILJS_SERVICE_ID = 'service_18y0t3q'; // already set
const EMAILJS_TEMPLATE_ID = 'template_x2iqktb';                // add this
const EMAILJS_PUBLIC_KEY = 'mZLNo6tCAA_Fc8K_N';                 // add this
```

1. **Service ID** — already filled in (`service_18y0t3q`).
2. **Template ID** — in the dashboard, go to **Email Templates**, open (or create) your template, and copy its ID into `template_x2iqktb`.
3. **Public Key** — go to **Account → General**, copy the **Public Key**, and paste it into `mZLNo6tCAA_Fc8K_N`.

The form's field names (`name`, `email`, `message`) need to match the variables your EmailJS template uses — for example, a template written with `{{name}}`, `{{email}}`, and `{{message}}` will work with this form exactly as-is; if your template uses different variable names, either update the template or the `name` attributes on the inputs in `index.html` to match.

Until both the Template ID and Public Key are filled in, the form tells visitors it isn't connected yet rather than failing silently. EmailJS's free tier covers 200 emails/month.

If you'd rather not use a third party, [EmailJS](https://www.emailjs.com) works the same way (free tier, own dashboard) — keep the existing `submit` handler in `script.js` and call their SDK inside the `try` block instead of the `fetch(FORMSPREE_ENDPOINT, ...)` call.

## Design notes

- Palette stays strictly black/near-black with off-white text; the single muted green (`--signal`) is used only for "pass" style signals (cursor blink, status dot, form confirmation) — never as decoration.
- Type system: Space Grotesk (display headlines), Inter (body copy), JetBrains Mono (labels, tags, terminal, stats) — chosen to read as "engineering," not generic corporate.
- The hero's typing terminal and the fixed-position idea of a "test runner" identity are the signature device tying the whole site to test automation specifically, rather than a generic dark portfolio template.
- Animations are restrained: one-time scroll reveals, a single hero typing sequence, count-up stats — all respect `prefers-reduced-motion`.
