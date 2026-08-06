---

# Branch: version/v1.0.4

## Review
2026-08-06 15:45

### Score

Overall SEO Score: **58/100**

### Issues Found

#### Critical Issues (Blocking Indexing/Rankings)

1. **Client-side redirects for short URLs still break crawlability** — Short URL paths (e.g., `/z8HSYsk`) serve the React app HTML (200 OK), then redirect via `window.location.replace()` in `useEffect` (App.js:37). Search engines may not execute JS reliably; they see a 200 OK page with thin content instead of a proper 301/302. **This remains the #1 architectural blocker** — requires server/edge redirects (Cloudflare Workers, Netlify Edge Functions, Vercel, etc.).

2. **No dynamic meta tags per route (SPA limitation)** — All routes (`/`, `/abc123`, 404, 500) serve the same `index.html` with static metadata. No unique titles, descriptions, Open Graph, or Twitter Cards for individual short URLs or error pages.

3. **No canonical URLs** — No `<link rel="canonical">` on any page. Generator page needs self-canonical; short URL pages should canonicalize to destination (or self with `noindex`).

4. **No structured data (JSON-LD)** — Missing `WebApplication`, `SoftwareApplication`, or `WebSite` schema. No `BreadcrumbList`, `FAQPage`, or `HowTo` for the generator flow.

5. **Redirect paths should serve `noindex, nofollow`** — `robots.txt` allows all crawling (`Disallow:`). Short URL paths that redirect should be blocked or serve `X-Robots-Tag: noindex, nofollow` headers to avoid indexing thin redirect pages.

6. **Error pages return 200 OK instead of proper HTTP status** — 404 and 500 pages are rendered client-side with 200 OK. Search engines may index them as valid pages. Requires server-side status codes.

#### High Priority Issues

7. **Large unoptimized background images** — `sadTanukinbg.png` (~440 KB) and `tanuki2nbg.png` (~178 KB) loaded via CSS `background-image` with no compression, next-gen formats (WebP/AVIF), or responsive sizing. These block render and hurt Core Web Vitals (LCP).

8. **QR code served as inline base64 in JS bundle** — `useShortLink.js:29` sets `data:image/png;base64,${response.data.base64}` inflating JS bundle size, delaying interactivity (TBT/TTI), and preventing caching. Should serve as image URL with proper `Cache-Control`.

9. **No sitemap.xml** — No sitemap generated or referenced in `robots.txt`. Minimal sitemap should include `/` (generator), `/privacy`, `/terms` if they exist.

10. **Twitter Card uses `summary` not `summary_large_image`** — Missing `og:image` and `twitter:image` (1200×630). Social previews will lack visuals.

11. **Favicon set incomplete** — Only `favicon.ico` (multi-size), `logo192.png`, `logo512.png`. No `favicon.svg`, no `apple-touch-icon` (180×180) explicitly declared, no maskable icons in manifest.

12. **No `hreflang` or language alternatives** — Single language (en) but no explicit declaration beyond `<html lang="en">`.

#### Medium Priority Issues

13. **Manifest icons reference `favicon.ico` as primary** — `src: "favicon.ico"` with `sizes: "64x64 32x32 24x24 16x16"` is unconventional; prefer dedicated PNG icons with `purpose: "any maskable"`.

14. **Loading state shows generic `<h1>Loading...</h1>`** — Not meaningful for accessibility/SEO if indexed; consider `aria-busy` or skeleton UI.

15. **No `Content-Security-Policy` meta tag** — Inline scripts/styles (React dev) and external API calls; CSP would improve security posture (indirect SEO signal).

#### Low Priority / Nice-to-Have

16. **Background images lack `preload` for LCP candidate** — The main page background (`tanuki2nbg.png`) is an LCP candidate; add `<link rel="preload" as="image">`.

17. **Font loading: system fonts only** — Good for performance, but no `font-display` control needed (already optimal).

18. **No `viewport-fit=cover` for notch devices** — Minor PWA enhancement.

---

### ✅ RESOLVED Since Previous Review (32/100 → 58/100)

| Issue | Status | Location |
|-------|--------|----------|
| Boilerplate meta description | ✅ Fixed | `public/index.html:9-11` — now descriptive, keyword-rich |
| Open Graph tags missing | ✅ Fixed | `public/index.html:13-20` — `og:type`, `og:title`, `og:description`, `og:url` |
| Twitter Card tags missing | ✅ Fixed | `public/index.html:22-28` — `twitter:card`, `twitter:title`, `twitter:description` |
| No `<h1>` on any page | ✅ Fixed | `QRGenerator.jsx:19` (`<h1 className="App-title">`), `404.jsx:7`, `page500.jsx:7` |
| Heading hierarchy broken | ✅ Fixed | Proper `<h1>` → `<h2>` structure on all pages |
| `class` attribute in JSX | ✅ Fixed | `404.jsx`, `page500.jsx` now use `className` |
| Form uses `action={fn}` | ✅ Fixed | `QRGenerator.jsx:22` — `<form onSubmit={handleSubmit}>` with `<button type="submit">` |
| Input missing label | ✅ Fixed | `QRGenerator.jsx:23-24` — `<label htmlFor="desired-url">` |
| Error message no `role=alert` | ✅ Fixed | `QRGenerator.jsx:45` — `<p role="alert">` |
| QR code `alt="logo"` | ✅ Fixed | `QRGenerator.jsx:56` — `alt={`QR code for ${originalLink}`}` |
| Semantic HTML gaps | ✅ Fixed | `<main>` added to all pages (`QRGenerator.jsx:18`, `404.jsx:6`, `page500.jsx:6`) |
| Manifest.json boilerplate | ✅ Fixed | `public/manifest.json` — correct `short_name`, `name`, `description`, `theme_color`, `background_color` |
| Favicon not linked | ✅ Fixed | `public/index.html:5` — `<link rel="icon" href="%PUBLIC_URL%/favicon.ico">` |
| `apple-touch-icon` missing | ✅ Fixed | `public/index.html:30` — linked to `logo192.png` |
| Preconnect for API domains | ✅ Fixed | `public/index.html:38-39` — `preconnect` for `api.antares.ninja`, `tanuki.click` |
| `background-size: cover` missing on 404/500 | ✅ Fixed | `error-page.css:12` — now set |
| Text contrast on error pages | ✅ Improved | Text shadows added for readability on dark backgrounds |

---

### NEW Issues / Regressions Identified

1. **Twitter Card type is `summary` not `summary_large_image`** — Without `og:image`/`twitter:image`, social shares show no image. Add 1200×630 branded image.

2. **Manifest uses `favicon.ico` as icon source** — Unconventional; may not render correctly on all platforms. Add dedicated PNG icons with `purpose: "any maskable"`.

3. **Loading state `<h1>Loading...</h1>` could be indexed** — If a search engine captures the loading state, it sees meaningless content. Consider `aria-hidden="true"` on loading overlay or server-side rendering.

---

### Recommendations

#### Immediate (Week 1)

1. **Implement server-side redirects for short URLs** — Move redirect logic to backend/edge (Cloudflare Workers, Netlify Edge Functions, Vercel Edge, Apache/Nginx rewrite). Return 301/302 with `Location` header. Short URL paths must **not** serve React HTML.

2. **Add dynamic meta tags via SSR or prerendering** — Migrate to Next.js, Remix, Vite+SSR, or use `react-helmet-async` with a prerendering service (prerender.io, Netlify Prerender) to inject unique `<title>`, `<meta name="description">`, OG/Twitter tags, and canonical per route.

3. **Add canonical URLs** — Generator page: self-canonical (`https://tanuki.click/`). Short URL pages: canonical = destination URL (or self with `noindex`).

4. **Add JSON-LD structured data** — `WebApplication` schema for the generator; `WebSite` with `SearchAction` for the input form.

5. **Add `og:image` and `twitter:image` (1200×630)** — Create branded social preview image; update `index.html` and Twitter Card to `summary_large_image`.

6. **Add `X-Robots-Tag: noindex, nofollow` for redirect paths** — Via edge function or server config.

#### Short-term (Week 2–3)

7. **Optimize background images** — Convert to WebP/AVIF, compress to <100 KB each, serve via `<picture>` or CSS `image-set()`, add `preload` for LCP candidate.

8. **Remove base64 QR from JS bundle** — Generate QR as blob URL or serve from API as image URL (`<img src="/api/qr?data=...">`). Cache with `Cache-Control: max-age=31536000, immutable`.

9. **Generate sitemap.xml** — Include `/` (generator), `/privacy`, `/terms` if they exist. Reference in `robots.txt`: `Sitemap: https://tanuki.click/sitemap.xml`.

10. **Complete favicon set** — Add `favicon.svg`, `apple-touch-icon` (180×180), manifest icons with proper `sizes` and `purpose` (any/maskable).

11. **Fix manifest icon references** — Replace `favicon.ico` entry with dedicated PNG icons (192, 512) with `purpose: "any maskable"`.

12. **Add proper HTTP status codes for error pages** — 404 page → 404 status, 500 page → 503/500 status (requires server/edge).

#### Medium-term (Month 1+)

13. **Migrate to SSR framework (Next.js/Remix/Astro)** — Solves dynamic meta, redirects, performance, and SEO holistically.

14. **Add Web Vitals monitoring** — `web-vitals` library + analytics.

15. **Implement `hreflang` if multi-language planned**.

16. **Add `Content-Security-Policy`** — Start with `Report-Only` mode.

---

### Files Reviewed

- public/index.html
- public/manifest.json
- public/robots.txt
- public/favicon.ico
- public/logo192.png
- public/logo512.png
- src/App.js
- src/config.js
- src/components/QRGenerator.jsx
- src/hooks/useShortLink.js
- src/pages/404.jsx
- src/pages/page500.jsx
- src/styles/error-page.css
- src/App.css
- src/index.css
- src/img/sadTanukinbg.png (~440 KB)
- src/img/tanuki2nbg.png (~178 KB)
- src/img/qr-placeholder.jpeg
- build/index.html (production output)
- build/robots.txt
- build/manifest.json

---

### Summary

**Tanuki has made significant frontend SEO improvements since the last review (32 → 58/100).** The "quick wins" are largely resolved: meta description, Open Graph, Twitter Cards, heading hierarchy, semantic HTML, form accessibility, manifest branding, favicons, and preconnect hints are now correct.

**However, the two architectural blockers remain unfixed and continue to cap the score:**

1. **Client-side redirects for short URLs** — The core product (link shortening) cannot be indexed correctly. Search engines see 200 OK + React HTML instead of 301/302 → destination. Link equity is lost. **This requires server/edge infrastructure changes, not frontend code.**

2. **No dynamic per-route metadata** — All routes share the same static `<head>`. Short URLs, 404, and 500 pages cannot have unique titles, descriptions, OG tags, or canonicals without SSR/prerendering.

**Without fixing these, Tanuki will remain invisible for its primary keywords** ("URL shortener", "QR code generator", "short link"). The 58/100 reflects a well-optimized *landing page* but a fundamentally broken *product* for SEO.

**Priority order:**
1. Edge/server 301/302 redirects for `/:shortCode` paths (infrastructure)
2. Prerender or SSR for dynamic metadata (framework migration or prerendering service)
3. Canonical URLs + JSON-LD + sitemap.xml
4. Image optimization (WebP/AVIF, preload)
5. Base64 QR removal from bundle

The frontend code is now clean and accessible; the remaining gaps are infrastructure and architecture.

---


(End of file)