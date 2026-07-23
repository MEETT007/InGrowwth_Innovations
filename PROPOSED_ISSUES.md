# Proposed GitHub Issues for InGrowwth Innovations

Here is a curated list of high-priority GitHub Issues to further refine, optimize, and scale the InGrowwth Innovations website.

---

## Issue #9: CMS / Dynamic Content Integration for Blog & Careers
**Type:** Feature / Architecture  
**Priority:** High  

### Description
Currently, blog posts and career opportunities rely on static mock data inside `src/lib/mock-data.ts`. To make the website manageable for non-technical team members, integrate a headless CMS (e.g., Sanity.io, Strapi, or MDX / Contentlayer) or database (Prisma + PostgreSQL).

### Tasks
- [ ] Choose and configure headless CMS or Database layer.
- [ ] Connect dynamic data fetching to `/blog`, `/blog/[slug]`, `/careers`, and `/careers/[id]`.
- [ ] Implement revalidation / ISR (Incremental Static Regeneration) for fast load times.

---

## Issue #10: Dynamic SEO & Structured Data (JSON-LD)
**Type:** Enhancement / SEO  
**Priority:** High  

### Description
Enhance search engine visibility and social media shareability by implementing dynamic OpenGraph meta tags and structured JSON-LD schemas.

### Tasks
- [ ] Implement `generateMetadata()` for dynamic routes (`/blog/[slug]`, `/careers/[id]`, `/projects/[id]`).
- [ ] Add `JobPosting` schema markup for career listings to index on Google Jobs.
- [ ] Add `BlogPosting` and `Organization` schema markup.
- [ ] Generate dynamic `sitemap.ts` and `robots.ts`.

---

## Issue #11: Contact Form & Job Application Email Backend
**Type:** Feature / Backend  
**Priority:** High  

### Description
Connect the contact page form (`/contact`) and job application modal (`/careers/[id]/apply-modal.tsx`) to an email service provider (e.g., Resend, SendGrid, or AWS SES).

### Tasks
- [ ] Create Next.js API route handler `/api/contact` and `/api/apply`.
- [ ] Add Zod validation on client & server side for inputs and file uploads (resume attachments).
- [ ] Integrate email notifications to HR and sales team upon form submission.
- [ ] Add user confirmation toast / success screens.

---

## Issue #12: Performance & Asset Optimization (Next.js Image & WebP)
**Type:** Performance  
**Priority:** Medium  

### Description
Optimize page load speeds and overall Lighthouse score by replacing standard `<img>` tags with Next.js `<Image />` component.

### Tasks
- [ ] Replace `<img>` in blog cards, author avatars, and project previews with `next/image`.
- [ ] Add responsive `sizes` attribute and blur placeholders (`placeholder="blur"`).
- [ ] Enable image optimization and WebP/AVIF formatting in `next.config.ts`.

---

## Issue #13: Accessibility (a11y) & Theme Contrast Audit
**Type:** UX / Accessibility  
**Priority:** Medium  

### Description
Perform a comprehensive accessibility audit across dark and light modes to ensure WCAG 2.1 AA compliance.

### Tasks
- [ ] Audit color contrast ratios for text vs. background across both theme modes.
- [ ] Ensure proper keyboard navigation (`tabindex`, focus rings) on interactive elements.
- [ ] Add missing `aria-label` attributes to mobile menu toggle, icons, and theme switch.

---

## Issue #14: Interactive Project Case Studies & Technology Filters
**Type:** Feature / UI  
**Priority:** Low  

### Description
Expand the `/projects` showcase section with interactive technology filter tags (e.g. React, Next.js, Cloud, AI) and rich detail pages for client case studies.

### Tasks
- [ ] Build `/projects/[id]` detail page route.
- [ ] Add animated tag filtering on `/projects` page.
- [ ] Add live preview links and client testimonial quotes inside case studies.
