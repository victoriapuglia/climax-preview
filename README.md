# Climax · The Entertainment Hub — website (v2)

A static site with no build step: plain HTML, CSS and JS. It runs on any web host.

```
index.html     home page (scrolls from day into night)
menu.html      menu (built from data/menu.js)
contact.html   details, map and table-booking form (WhatsApp)
404.html
data/          ← edit these to update the site
assets/        css, js, img (optimised photos), brand (logo, mark, icons)
images/, logo.jpg   original source files (not used by the pages)
```

## Preview locally
Run `python3 -m http.server 8743 --directory climax_v2` from the parent folder, then open http://localhost:8743. You can also use the `climax_v2` entry in `.claude/launch.json`.

## What to edit
| To change… | Edit |
|---|---|
| Address, phone, hours, price range, socials, email | `data/site.js` |
| Menu items and prices | `data/menu.js`. Empty categories are hidden. While the whole menu is empty, the page shows "Served at your table" with WhatsApp and call buttons. |
| "This week" events on the home page | `data/events.js`. Add real nights to `items` and a list appears under "Around the clock". With no items, nothing is shown. |

## Owner checklist before launch
- [ ] Confirm the facts taken from the Google listing (11 Oct 2026): **29e Mobutu Road**, **0702 278 615**, **Open 24 hours**, **4.1★ from 720 reviews**, **UGX 20,000–100,000 per person**, rooftop and outdoor seating.
- [ ] Is **0702 278 615 on WhatsApp**? The booking form sends requests there. If yes, set `whatsapp.confirmed: true`. If not, put the right WhatsApp number in `data/site.js`.
- [ ] Send the **real menu** (dishes, drinks, prices).
- [ ] Send **real weekly events** (optional).
- [ ] Add the **Instagram / Facebook / TikTok** links and an email.
- [ ] Check the wording on the home page (pool tables, big-screen sport, DJ and dance floor, loungers, rooftop, food served poolside). It's based on the photos and the Google listing.
- [ ] **Hero image:** `images/Ugandan Poolside Gathering at Golden Dusk.png` is an AI-generated mood image, not a photo of Climax. Replace `assets/img/hero-dusk.webp` and `-sm.webp` with a real dusk photo of the venue when you have one (1600px and 800px wide).
- [ ] Set the real domain in the Open Graph and schema tags once the site has an address.

## Design
Fonts: Bodoni Moda (headings) and Jost (text), both from Google Fonts. Colours: forest `#13281f`, ink `#0b100d`, paper `#f5f0e6`, gold `#c4a265`. The sign's neon green only appears as the small dot in the header clock. Sharp corners, thin rules, and no rounded cards.

## Adding a photo
Save it as WebP (about 1600px wide, plus an 800px `-sm` copy) in `assets/img/`, then reference it in the HTML with a real `alt` description.
