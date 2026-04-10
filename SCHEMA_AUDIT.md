# Schema.org Structured Data Audit - parifoot.online

**Date:** 2026-04-04
**Auditor:** Claude Opus 4.6 (Schema.org Specialist)
**Overall Score:** 78/100

---

## Executive Summary

Parifoot.online has a **solid foundation** of JSON-LD structured data across all major pages. The site uses proper `@context: "https://schema.org"`, absolute URLs, and the `@graph` pattern for multi-entity pages. However, there are several **validation issues**, **missing opportunities**, and **one critical problem** on the livescore page that need attention.

### Key Findings

| Area | Status | Notes |
|------|--------|-------|
| Organization schema | PASS | Present in global layout, well-formed |
| WebSite + SearchAction | PASS | Present in global layout |
| BreadcrumbList | PASS | Present on 5/6 audited pages |
| Article schema | PASS | Present on blog detail pages with author |
| FAQPage schema | INFO | Present on homepage + predictions (no Google rich results for commercial sites since Aug 2023) |
| Livescore SportsEvent | FAIL | Incorrectly implemented - critical |
| Blog listing schema | PASS | Blog + CollectionPage present |
| Stats page schema | PASS | WebPage + BreadcrumbList |
| About page schema | PASS | AboutPage + BreadcrumbList |
| llms.txt | PASS | Both llms.txt and llms-full.txt present |
| AI-citable passages | PASS | Structured prose on homepage, predictions, about |

---

## Page-by-Page Analysis

---

### 1. GLOBAL LAYOUT (`/[locale]/layout.tsx`)

**Existing Schema:**
- Organization (with logo, sameAs, contactPoint)
- WebSite (with SearchAction)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| @type valid and not deprecated | PASS |
| Required properties present | PASS |
| URLs absolute | PASS |
| No placeholders | PASS |
| @id anchors for cross-referencing | PASS |

**Issues Found:**

1. **[Minor]** `logo.width` and `logo.height` should be Number type (they are, good), but the logo should ideally also have a `contentUrl` property for best practice.

2. **[Minor]** SearchAction `urlTemplate` uses a dynamic `${locale}` variable which means it generates correctly per-locale. Good.

**Verdict:** PASS - Well implemented.

---

### 2. HOMEPAGE (`/[locale]/page.tsx`)

**Existing Schema:**
- WebPage (with @id, isPartOf reference to WebSite)
- BreadcrumbList (single item - Home)
- FAQPage (5 questions with dynamic win rate data)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| WebPage required props | PASS |
| BreadcrumbList format | PASS |
| FAQPage structure | PASS |
| Cross-references (@id) | PASS |

**Issues Found:**

1. **[Info - Not Critical]** FAQPage is present but Google removed rich result eligibility for commercial sites in August 2023. This is NOT harmful -- FAQPage schema still benefits AI/LLM citations and Bing. Keep it, but do not expect Google FAQ rich results.

2. **[Missing]** No `SoftwareApplication` or `WebApplication` schema for the AI prediction tool itself. This is a missed opportunity for Google's "Software App" rich results.

**Verdict:** PASS with note on FAQ.

---

### 3. PREDICTIONS PAGE (`/[locale]/predictions/page.tsx`)

**Existing Schema:**
- CollectionPage (with dynamic prediction counts)
- BreadcrumbList (Home > Predictions)
- FAQPage (4 questions)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| CollectionPage valid | PASS |
| BreadcrumbList format | PASS |
| FAQPage structure | PASS |

**Issues Found:**

1. **[Info]** Same FAQPage note as homepage -- no Google rich results for commercial sites.

2. **[Missing - Recommended]** Individual match predictions could each have `SportsEvent` schema with structured data about the teams, competition, and predicted outcome. This would be a significant enhancement for Google Discover and AI search.

3. **[Missing]** No `ItemList` schema wrapping the predictions, which would help search engines understand the page as a list of structured items.

**Verdict:** PASS - Could be enhanced with SportsEvent entities.

---

### 4. LIVESCORE PAGE (`/[locale]/livescore/page.tsx`)

**Existing Schema:**
- SportsEvent (single entity, NOT in @graph)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| @type valid | FAIL - Misused |
| Required properties | FAIL |

**Issues Found:**

1. **[CRITICAL]** The `SportsEvent` schema is used as a **page-level** descriptor for the livescore page itself, not for actual sporting events. A `SportsEvent` must represent a **specific** sporting event with required properties:
   - `startDate` (REQUIRED - missing)
   - `location` (REQUIRED - missing)
   - `competitor` or `performer` (RECOMMENDED - missing)

   The current implementation wraps the entire livescore page as one SportsEvent called "Live Scores - PronoFoot AI" which is semantically incorrect.

2. **[CRITICAL]** No BreadcrumbList on this page (present on all other pages).

3. **[Missing]** Should use `WebPage` or `CollectionPage` as the page-level entity, and optionally `SportsEvent` for each individual live match (if practical).

**Verdict:** FAIL - Needs rewrite.

---

### 5. BLOG LISTING PAGE (`/[locale]/blog/page.tsx`)

**Existing Schema:**
- Blog (with publisher)
- CollectionPage (with numberOfItems)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| Blog type valid | PASS |
| CollectionPage valid | PASS |
| Publisher reference | PASS |

**Issues Found:**

1. **[Minor]** Two separate `<script type="application/ld+json">` blocks instead of one `@graph`. While technically valid, a single @graph is cleaner and ensures Google processes them as related entities.

2. **[Missing]** No BreadcrumbList (Home > Blog). Every other major page has one.

3. **[Missing]** `Blog.blogPost` property could list the latest articles as `BlogPosting` references for richer indexing.

**Verdict:** PASS with minor improvements needed.

---

### 6. BLOG ARTICLE DETAIL (`/[locale]/blog/[slug]/page.tsx`)

**Existing Schema:**
- Article (with author as Person, publisher as Organization, full metadata)
- BreadcrumbList (Home > Blog > Article Title)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| Article required props | PASS |
| author as Person | PASS |
| publisher with logo | PASS |
| datePublished ISO 8601 | PASS (from DB) |
| BreadcrumbList | PASS |
| mainEntityOfPage | PASS |

**Issues Found:**

1. **[Minor]** `@type: "Article"` could be more specific. For match previews use `NewsArticle`, for guides use `Article`. Google supports both for rich results.

2. **[Minor]** Last BreadcrumbList item (position 3) has `name` but no `item` URL. Google documentation states the last item should omit `item` (which is correct), so this is fine.

3. **[Good]** Author as `Person` type with `worksFor` Organization is excellent for E-E-A-T.

**Verdict:** PASS - Well implemented.

---

### 7. STATS PAGE (`/[locale]/stats/page.tsx`)

**Existing Schema:**
- WebPage (with dynamic win rate in description)
- BreadcrumbList (Home > Stats)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| WebPage valid | PASS |
| BreadcrumbList | PASS |

**Issues Found:**

1. **[Missing - Recommended]** This page is a perfect candidate for a `Dataset` schema to describe the AI performance data. Google supports Dataset rich results in search.

2. **[Missing]** No `Table` or structured data representation of the statistics, which would help AI search engines cite specific numbers.

**Verdict:** PASS - Could be enhanced with Dataset schema.

---

### 8. ABOUT PAGE (`/[locale]/about/page.tsx`)

**Existing Schema:**
- AboutPage (with isPartOf and about references)
- BreadcrumbList (Home > About)

**Validation:**

| Check | Result |
|-------|--------|
| @context = "https://schema.org" | PASS |
| AboutPage valid | PASS |
| Cross-references | PASS |
| BreadcrumbList | PASS |

**Issues Found:**

1. **[Missing - Recommended]** Should include the Organization entity inline or reference it, with expanded properties like `foundingDate`, `foundingLocation`, `areaServed`, `knowsAbout`.

**Verdict:** PASS - Minor enhancements possible.

---

## AI Search Optimization Check

### llms.txt

**Status:** PRESENT at `/public/llms.txt`

Content is well-structured with:
- Clear one-line description
- Key pages with descriptions
- Prediction markets listed
- Leagues covered
- Contact information
- Link to `llms-full.txt` for complete documentation

### llms-full.txt

**Status:** PRESENT at `/public/llms-full.txt`

Comprehensive reference document covering:
- How the AI works (5-step pipeline)
- All key pages with URLs and descriptions
- Leagues covered
- Technical stack
- Data freshness schedule
- Brand information
- Explicit AI citation permissions

**Verdict:** Excellent. Both files are well-structured for AI search engine consumption.

### Citable Passages

| Page | Citable Prose | Quality |
|------|--------------|---------|
| Homepage | "How PronoFoot AI Works" section | Good - structured paragraphs with data |
| Predictions | Intro paragraph with dynamic stats | Good |
| About | Full methodology, story, transparency sections | Excellent |
| Stats | Methodology note with bullet points | Good |
| Blog listing | Minimal | Needs improvement |
| Livescore | None | Missing |

---

## Recommended JSON-LD Implementations

### FIX 1: Livescore Page (CRITICAL - Replace existing schema)

File: `src/app/[locale]/livescore/page.tsx`

Replace the current `jsonLd` object (lines 133-141) with:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "name": "Live Football Scores - PronoFoot AI",
      "description": "Real-time live football scores and results, updated every 60 seconds. Only matches with AI predictions are shown.",
      "url": "https://www.parifoot.online/en/livescore",
      "isPartOf": { "@id": "https://www.parifoot.online/#website" },
      "about": {
        "@type": "Thing",
        "name": "Football Live Scores"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.parifoot.online/en"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Livescore"
        }
      ]
    }
  ]
}
```

---

### FIX 2: Blog Listing Page - Add BreadcrumbList and merge to @graph

File: `src/app/[locale]/blog/page.tsx`

Replace the two separate script blocks (lines 553-596) with a single merged block:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": "https://www.parifoot.online/en/blog/#blog",
      "name": "PronoFoot AI Blog",
      "description": "Football analysis, predictions, and recaps powered by AI",
      "url": "https://www.parifoot.online/en/blog",
      "publisher": {
        "@id": "https://www.parifoot.online/#organization"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "CollectionPage",
      "name": "Football Blog Archive",
      "description": "Browse all PronoFoot AI articles by category",
      "url": "https://www.parifoot.online/en/blog",
      "isPartOf": { "@id": "https://www.parifoot.online/#website" },
      "mainEntity": { "@id": "https://www.parifoot.online/en/blog/#blog" },
      "numberOfItems": 42
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.parifoot.online/en"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog"
        }
      ]
    }
  ]
}
```

---

### ENHANCEMENT 3: Stats Page - Add Dataset schema

File: `src/app/[locale]/stats/page.tsx`

Add to the existing `@graph` array:

```json
{
  "@type": "Dataset",
  "name": "PronoFoot AI Prediction Performance Data",
  "description": "Complete win/loss tracking across 7 football prediction markets, updated daily. Includes accuracy by confidence tier, risk level, and individual market.",
  "url": "https://www.parifoot.online/en/stats",
  "creator": { "@id": "https://www.parifoot.online/#organization" },
  "license": "https://www.parifoot.online/en/terms",
  "temporalCoverage": "2026-01/..",
  "variableMeasured": [
    "1X2 prediction accuracy",
    "Over 2.5 goals accuracy",
    "Over 1.5 goals accuracy",
    "BTTS accuracy",
    "Home to Score accuracy",
    "Away to Score accuracy",
    "Best Pick accuracy"
  ]
}
```

---

### ENHANCEMENT 4: About Page - Expanded Organization

File: `src/app/[locale]/about/page.tsx`

Add to the existing `@graph` array in `aboutJsonLd`:

```json
{
  "@type": "Organization",
  "@id": "https://www.parifoot.online/#organization",
  "name": "PronoFoot AI",
  "url": "https://www.parifoot.online",
  "foundingDate": "2026",
  "foundingLocation": {
    "@type": "Place",
    "name": "Douala, Cameroon"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 4.0511,
      "longitude": 9.7679
    },
    "geoRadius": "5000 km"
  },
  "knowsAbout": [
    "Football Predictions",
    "Artificial Intelligence",
    "Sports Analytics",
    "Betting Markets"
  ],
  "slogan": "500+ stats per match. No gut feeling. Just data."
}
```

---

### ENHANCEMENT 5: Predictions Page - SportsEvent for individual matches

This is a larger enhancement. In the predictions page, generate `SportsEvent` entities for each predicted match. Add this to the `@graph` array:

```json
{
  "@type": "SportsEvent",
  "name": "Manchester United vs Liverpool",
  "startDate": "2026-04-04T20:00:00+01:00",
  "homeTeam": {
    "@type": "SportsTeam",
    "name": "Manchester United"
  },
  "awayTeam": {
    "@type": "SportsTeam",
    "name": "Liverpool"
  },
  "location": {
    "@type": "StadiumOrArena",
    "name": "Old Trafford"
  },
  "sport": "https://www.wikidata.org/wiki/Q2736",
  "eventStatus": "https://schema.org/EventScheduled"
}
```

**Note:** Only implement this if you have venue data. The `startDate` and team names are already available in your fixtures data. `location` can be omitted if venue is unknown. Limit to 10-15 top matches to avoid bloating the page.

---

### ENHANCEMENT 6: WebApplication schema (Global or Homepage)

Add to the homepage `@graph`:

```json
{
  "@type": "WebApplication",
  "name": "PronoFoot AI",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "Web",
  "url": "https://www.parifoot.online",
  "description": "AI-powered football prediction platform analyzing 500+ statistics per match across 7 betting markets.",
  "offers": [
    {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "name": "Free Predictions"
    },
    {
      "@type": "Offer",
      "price": "4",
      "priceCurrency": "USD",
      "name": "VIP Classique (Weekly)",
      "url": "https://www.parifoot.online/en/vip"
    }
  ],
  "author": { "@id": "https://www.parifoot.online/#organization" },
  "inLanguage": ["fr", "en"]
}
```

---

## Priority Action Plan

| Priority | Action | Page | Effort |
|----------|--------|------|--------|
| 1 - CRITICAL | Fix SportsEvent misuse on livescore, replace with CollectionPage + BreadcrumbList | Livescore | 10 min |
| 2 - HIGH | Add BreadcrumbList to blog listing, merge to single @graph | Blog | 10 min |
| 3 - MEDIUM | Add Dataset schema to stats page | Stats | 5 min |
| 4 - MEDIUM | Add WebApplication schema to homepage | Homepage | 5 min |
| 5 - LOW | Add expanded Organization to about page | About | 5 min |
| 6 - LOW | Add SportsEvent per match on predictions (requires code change) | Predictions | 30 min |
| 7 - LOW | Consider using NewsArticle for match previews/recaps | Blog articles | 15 min |

---

## Google Rich Results Eligibility Summary

| Rich Result Type | Eligible | Status |
|------------------|----------|--------|
| Sitelinks Search Box | YES | SearchAction present in WebSite schema |
| Breadcrumbs | YES | Present on 5/6 pages (missing on blog listing + livescore) |
| Article | YES | Present on blog detail pages |
| FAQ | NO | Commercial site - no Google rich results (still useful for AI) |
| Dataset | YES (if added) | Stats page is ideal candidate |
| Software App | YES (if added) | WebApplication schema recommended |
| SportsEvent | YES (if fixed) | Currently misused on livescore |
| Organization Knowledge Panel | POSSIBLE | Organization schema present with sameAs |

---

## Files Audited

- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\layout.tsx` (global schema)
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\page.tsx` (homepage)
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\predictions\page.tsx`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\livescore\page.tsx`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\blog\page.tsx`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\blog\[slug]\page.tsx`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\stats\page.tsx`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\app\[locale]\about\page.tsx`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\src\lib\config.ts`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\public\llms.txt`
- `C:\Users\PC\OneDrive\Desktop\pronofoot-ai\public\llms-full.txt`
