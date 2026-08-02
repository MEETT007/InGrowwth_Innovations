import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { db } from '../src/lib/db';

async function main() {
  const legacyDir = path.join(__dirname, '..', 'legacy', 'Frontend');
  const files = fs
    .readdirSync(legacyDir)
    .filter((f) => f.startsWith('project') && f.endsWith('.html') && f !== 'projects.html');

  console.log(`Found ${files.length} legacy project files.`);

  // Wipe existing
  await db.portfolioProject.deleteMany({});
  await db.caseStudy.deleteMany({});
  console.log('Cleared existing projects and case studies.');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const html = fs.readFileSync(path.join(legacyDir, file), 'utf-8');
    const $ = cheerio.load(html);

    // Extract Title
    let title = $('h2').first().text().trim();
    if (!title) {
      title = $('title').text().replace(' | InGrowwth Innovations', '').trim();
    }

    // Extract Description
    let description = $('h2').first().next('p').text().trim();
    if (!description || description.length < 10) {
      description = $('meta[name="description"]').attr('content') || '';
    }

    // Extract Gallery (images inside .slides .slide)
    const galleryImages: string[] = [];
    $('.slides .slide img').each((_, el) => {
      let src = $(el).attr('src');
      if (src) {
        if (!src.startsWith('/')) {
          src = '/' + src;
        }
        galleryImages.push(src);
      }
    });

    // Extract Features (li inside Functionality card)
    const features: string[] = [];
    $('.highlight-card h4:contains("Functionality")')
      .parent()
      .siblings('.card-body')
      .find('li')
      .each((_, el) => {
        const text = $(el).text().trim();
        if (text) features.push(text);
      });

    // Extract Technologies (.tag-pill inside Technologies card)
    const technologiesUsed: string[] = [];
    $('.highlight-card h4:contains("Technologies")')
      .parent()
      .siblings('.card-body')
      .find('.tag-pill')
      .each((_, el) => {
        const text = $(el).text().trim();
        if (text) technologiesUsed.push(text);
      });

    // Extract Project Overview / Results (rest of the text content if any, or just use description)
    let projectOverview = '';
    $('main p').each((idx, el) => {
      const text = $(el).text().trim();
      if (idx > 0 && text.length > 30) {
        projectOverview += text + '\n\n';
      }
    });

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await db.portfolioProject.create({
      data: {
        title,
        slug: slug || `portfolio-project-${i}`,
        client: title,
        category: technologiesUsed.length > 0 ? technologiesUsed[0] : 'Web Development', // Default category based on tech
        description,
        gallery: galleryImages.length > 0 ? galleryImages.join(',') : null,
        coverImage: galleryImages.length > 0 ? galleryImages[0] : null,
        features: features.length > 0 ? JSON.stringify(features) : null,
        technologiesUsed: technologiesUsed.length > 0 ? JSON.stringify(technologiesUsed) : null,
        projectOverview: projectOverview.substring(0, 1500) || description,
      },
    });

    console.log(`Created Portfolio Project: ${title}`);
  }

  console.log('Done migrating legacy projects.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
