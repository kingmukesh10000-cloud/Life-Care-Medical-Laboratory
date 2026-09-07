# Life Care Medical Laboratory

A staff-facing web app for registering patients, entering test results against
normal ranges, and printing lab reports.

## Files

- `index.html` — page shell, loads the stylesheet and script
- `style.css` — all styling
- `script.js` — app logic (routing, forms, results, printable report)

No build step, no dependencies — plain HTML/CSS/JS.

## Run it locally

Just open `index.html` in a browser, or serve the folder with any static
server, e.g.:

```
npx serve .
```

## Push to GitHub

```
git init
git add .
git commit -m "Life Care Medical Laboratory app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy on Vercel

1. Go to vercel.com → **Add New Project** → import the GitHub repo.
2. Framework preset: **Other** (it's a static site — no build command or
   output directory needed).
3. Click **Deploy**. Vercel will serve `index.html` at your project's URL.

Every push to `main` will auto-redeploy.

## First login

- Username: `admin`
- Password: `admin123`

Change this immediately from **Staff Management** (visible to admin accounts)
and add accounts for your team.

## Important: how data is stored

This version stores staff accounts and patient records in the browser's
`localStorage`. That means:

- Data persists across page reloads and browser restarts on the **same
  device and browser**.
- It is **not shared** between different computers or browsers — if your
  reception desk and your lab bench are different machines, they won't see
  each other's records.
- Clearing browser data/cache will erase it. There's no encryption and no
  audit trail.

This is fine for trying out the workflow or running it on a single shared
computer, but it is **not a substitute for a real database** if multiple
staff on different devices need to see the same patient list, or if you're
handling real patient data at any scale. For that, you'd want to add a
backend — for example:

- **Supabase** or **Firebase** (hosted database + auth, easy to wire into
  this same front end)
- **Vercel Postgres** or **Neon** with a few serverless API routes

If you'd like, this can be extended to use one of those instead of
`localStorage` — just ask.

## Customizing test panels and reference ranges

Test types and their parameters/normal ranges live in the `TEST_TEMPLATES`
object near the top of `script.js`. Edit, add, or remove tests there. The
included ranges are general adult reference ranges — verify them against
your lab's own validated ranges before relying on them clinically.
