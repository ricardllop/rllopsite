/**
 * Generates and downloads an A4 PDF resume from profile.json data, in two variants.
 *
 * Designed layout (default, 1 page):
 *   - Dark navy header  : name, title (green live dot), location, contact links,
 *                         circular profile photo
 *   - Two-column body   : left  = about / certifications (badge images) / skills /
 *                                 languages / personal projects / education
 *                         right = experience (description + achievements)
 *   - Dark navy footer  : site name
 *
 * Plain layout ({ plain: true }): single column, text only, no images. For applicant
 * tracking systems, which read the two columns of the designed layout out of order.
 *
 * Color palette mirrors the site's CSS variables:
 *   NAVY       #001c38   --ifm-color-primary-darkest
 *   DARK_BLUE  #003366   --ifm-color-primary-darker
 *   BLUE       #6699cc   --ifm-color-primary
 *   LIGHT_BLUE #99ccff   --ifm-color-primary-light
 *   GREEN      #39d353   terminal accent
 */

import profileData from '@site/src/data/profile.json';

// ── Palette ───────────────────────────────────────────────────────────
const NAVY       = [0,   28,  56 ];
const DARK_BLUE  = [0,   51,  102];
const BLUE       = [102, 153, 204];
const LIGHT_BLUE = [153, 204, 255];
const GREEN      = [57,  211, 83 ];
const WHITE      = [255, 255, 255];
const BODY_TEXT  = [15,  30,  50 ];
const MID_TEXT   = [70,  100, 140];

// ── Typography ────────────────────────────────────────────────────────
const PT_TO_MM          = 0.352778;
const LINE_HEIGHT_FACTOR = 1.15;

/** Line height in mm for a given font size in pt. */
function lh(sizePt) {
  return sizePt * PT_TO_MM * LINE_HEIGHT_FACTOR;
}

// ── Localisation ──────────────────────────────────────────────────────

/** Returns the _es variant of obj[key] when locale is 'es', falls back to obj[key]. */
function loc(locale, obj, key) {
  const esKey = `${key}_es`;
  return locale === 'es' && obj[esKey] ? obj[esKey] : obj[key];
}

/** Public address of a site path in the given locale, without scheme (as printed in the PDF). */
function sitePath(locale, path) {
  return `${profileData.contact.website}${locale === 'es' ? '/es' : ''}${path}`;
}

const LABELS = {
  en: {
    about: 'ABOUT',
    certifications: 'CERTIFICATIONS',
    skills: 'SKILLS',
    languages: 'LANGUAGES',
    experience: 'EXPERIENCE',
    achieved: 'Achieved:',
    projects: 'PERSONAL PROJECTS',
    education: 'EDUCATION',
  },
  es: {
    about: 'SOBRE MÍ',
    certifications: 'CERTIFICACIONES',
    skills: 'HABILIDADES',
    languages: 'IDIOMAS',
    experience: 'EXPERIENCIA',
    achieved: 'Logros:',
    projects: 'PROYECTOS PERSONALES',
    education: 'EDUCACIÓN',
  },
};

// ── Image loading ─────────────────────────────────────────────────────

/**
 * Loads an image from a path relative to the site origin and returns a data URL.
 * Falls back to null on any load error so the PDF can still be generated.
 */
function loadImage(src) {
  const url = src.startsWith('http')
    ? src
    : `${window.location.origin}/${src}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth  || 200;
      canvas.height = img.naturalHeight || 200;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Loads an image, clips it to a circle using a canvas, and returns a data URL.
 * The `canvasSize` controls resolution (pixels); larger = sharper in the PDF.
 */
function loadCircularImage(src, canvasSize = 300) {
  const url = src.startsWith('http')
    ? src
    : `${window.location.origin}/${src}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// ── Drawing helpers ───────────────────────────────────────────────────

/**
 * Draws a bold blue section label with a hairline underline rule.
 * Returns the y position of the first content line below it.
 */
function drawSectionLabel(doc, label, x, y, width) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BLUE);
  doc.text(label, x, y);

  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.25);
  doc.line(x, y + 1.3, x + width, y + 1.3);

  return y + lh(8) + 1.5;
}

/**
 * Draws auto-wrapped text and returns the y position after the last line.
 * `gapAfter` adds extra padding below the block.
 */
function drawText(doc, text, x, y, width, sizePt, color, style = 'normal', gapAfter = 0) {
  doc.setFont('helvetica', style);
  doc.setFontSize(sizePt);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * lh(sizePt) + gapAfter;
}

// ── PDF generation ────────────────────────────────────────────────────

const yearsExp   = new Date().getFullYear() - profileData.careerStartYear;
const resolveText = (text) => text.replace('{yearsExp}', yearsExp);

/**
 * Builds and triggers a download of the PDF resume.
 * jsPDF is imported dynamically — safe for Docusaurus SSR.
 * Pass locale='es' to generate the Spanish version, and { plain: true } for the
 * single-column text-only variant.
 */
export async function downloadResume(locale = 'en', { plain = false } = {}) {
  const { jsPDF } = await import('jspdf');
  const L = LABELS[locale] || LABELS.en;

  if (plain) {
    const plainDoc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    drawPlainResume(plainDoc, locale, L);
    plainDoc.save('ricard-llop-resume-plain.pdf');
    return;
  }

  // Load all images in parallel before drawing anything
  const [profileImgData, ...badgeImgData] = await Promise.all([
    loadCircularImage(profileData.profileImage.src, 300),
    ...profileData.badges.map(b => loadImage(b.image)),
  ]);

  const doc    = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const PAGE_W = 210;
  const MARGIN = 13;

  // ── HEADER ────────────────────────────────────────────────────────
  const HEADER_H = 44;
  const PHOTO_D  = 32;   // profile photo diameter in mm
  const PHOTO_X  = PAGE_W - MARGIN - PHOTO_D;
  const PHOTO_Y  = (HEADER_H - PHOTO_D) / 2;

  // Navy background + left accent strip
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F');
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, 3.5, HEADER_H, 'F');

  // Circular profile photo + blue ring border
  if (profileImgData) {
    doc.addImage(profileImgData, 'PNG', PHOTO_X, PHOTO_Y, PHOTO_D, PHOTO_D);
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.7);
    doc.circle(PHOTO_X + PHOTO_D / 2, PHOTO_Y + PHOTO_D / 2, PHOTO_D / 2, 'S');
  }

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...WHITE);
  doc.text(
    `${profileData.name.toUpperCase()} ${profileData.lastName.toUpperCase()}`,
    MARGIN, 17
  );

  // Green status dot + role title
  doc.setFillColor(...GREEN);
  doc.circle(MARGIN, 25.5, 1.4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT_BLUE);
  doc.text(profileData.title, MARGIN + 5, 26);

  const location = loc(locale, profileData, 'location');
  if (location) {
    const titleW = doc.getTextWidth(profileData.title);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 210, 245);
    doc.text(`|   ${location}`, MARGIN + 5 + titleW + 4, 26);
  }

  // Separator (stops before the photo)
  doc.setDrawColor(...DARK_BLUE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 32, profileImgData ? PHOTO_X - 4 : PAGE_W - MARGIN, 32);

  // Contact info — every entry is a link
  const { email, linkedin, github, website } = profileData.contact;
  const contacts = [
    [email,    `mailto:${email}`],
    [linkedin, `https://${linkedin}`],
    [github,   `https://${github}`],
    [website,  `https://${website}`],
  ];
  const CONTACT_SEP = '   |   ';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 210, 245);
  let cx = MARGIN;
  contacts.forEach(([label, url], i) => {
    if (i > 0) {
      doc.text(CONTACT_SEP, cx, 38);
      cx += doc.getTextWidth(CONTACT_SEP);
    }
    doc.textWithLink(label, cx, 38, { url });
    cx += doc.getTextWidth(label);
  });

  // ── COLUMN SETUP ──────────────────────────────────────────────────
  const BODY_TOP  = HEADER_H + 7;
  const LEFT_X    = MARGIN;
  const LEFT_W    = 58;
  const DIVIDER_X = LEFT_X + LEFT_W + 5;
  const RIGHT_X   = DIVIDER_X + 5;
  const RIGHT_W   = PAGE_W - RIGHT_X - MARGIN;

  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.2);
  doc.line(DIVIDER_X, BODY_TOP, DIVIDER_X, 282);

  // ── LEFT COLUMN : About / Certifications / Skills / Languages / Projects / Education ──
  let ly = BODY_TOP;

  // About
  ly = drawSectionLabel(doc, L.about, LEFT_X, ly, LEFT_W);
  for (const paragraph of loc(locale, profileData, 'description')) {
    ly = drawText(doc, resolveText(paragraph), LEFT_X, ly, LEFT_W, 8, BODY_TEXT, 'normal', 2.5);
  }

  ly += 3;

  // Certifications — badge image on the left, name text on the right
  ly = drawSectionLabel(doc, L.certifications, LEFT_X, ly, LEFT_W);

  const BADGE_SIZE  = 10;   // image size in mm (square)
  const BADGE_GAP   = 3;    // gap between image and text
  const BADGE_TEXT_X = LEFT_X + BADGE_SIZE + BADGE_GAP;
  const BADGE_TEXT_W = LEFT_W - BADGE_SIZE - BADGE_GAP;

  for (let i = 0; i < profileData.badges.length; i++) {
    if (badgeImgData[i]) {
      doc.addImage(badgeImgData[i], 'PNG', LEFT_X, ly, BADGE_SIZE, BADGE_SIZE);
    }

    // Vertically center the name within the badge image height
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const nameLines  = doc.splitTextToSize(profileData.badges[i].name, BADGE_TEXT_W);
    const textHeight = nameLines.length * lh(8);
    const textBaseY  = ly + (BADGE_SIZE - textHeight) / 2 + lh(8) * 0.75;
    doc.setTextColor(...BODY_TEXT);
    doc.text(nameLines, BADGE_TEXT_X, textBaseY);

    ly += BADGE_SIZE + 2;
  }

  ly += 3;

  // Skills
  ly = drawSectionLabel(doc, L.skills, LEFT_X, ly, LEFT_W);
  ly = drawText(doc, profileData.skills.join(' / '), LEFT_X, ly, LEFT_W, 8, MID_TEXT);

  ly += 3;

  // Languages
  const languages = loc(locale, profileData, 'languages');
  if (languages) {
    ly = drawSectionLabel(doc, L.languages, LEFT_X, ly, LEFT_W);
    ly = drawText(doc, languages.join(' / '), LEFT_X, ly, LEFT_W, 8, MID_TEXT);

    ly += 3;
  }

  // Personal Projects
  ly = drawSectionLabel(doc, L.projects, LEFT_X, ly, LEFT_W);

  for (const project of profileData.projects) {
    ly = drawText(doc, loc(locale, project, 'title'), LEFT_X, ly, LEFT_W, 8.5, BODY_TEXT, 'bold', 0.5);
    ly = drawText(doc, loc(locale, project, 'description'), LEFT_X, ly, LEFT_W, 7.5, BODY_TEXT, 'normal', 1.5);

    const link = sitePath(locale, project.link);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...BLUE);
    doc.textWithLink(link, LEFT_X, ly, { url: `https://${link}` });
    ly += lh(7.5) + 3;
  }

  // Education — title wraps in the narrow column; school (left) + date (right) below it
  ly = drawSectionLabel(doc, L.education, LEFT_X, ly, LEFT_W);

  for (const exp of profileData.experiences.filter(e => e.type === 'education')) {
    ly = drawText(doc, loc(locale, exp, 'title'), LEFT_X, ly, LEFT_W, 8.5, BODY_TEXT, 'bold', 0.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...BLUE);
    doc.text(exp.subtitle, LEFT_X, ly);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MID_TEXT);
    doc.text(exp.date, LEFT_X + LEFT_W, ly, { align: 'right' });

    ly += lh(8) + 3;
  }

  // ── RIGHT COLUMN : Experience ─────────────────────────────────────
  let ry = BODY_TOP;

  // Experience
  ry = drawSectionLabel(doc, L.experience, RIGHT_X, ry, RIGHT_W);

  for (const exp of profileData.experiences.filter(e => e.type === 'work')) {
    const expTitle = loc(locale, exp, 'title');
    const expDate  = loc(locale, exp, 'date');
    const expDesc  = loc(locale, exp, 'description');
    const expAchieved = loc(locale, exp, 'achievements');

    // Job title (left) + date (right) on the same baseline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...BODY_TEXT);
    doc.text(expTitle, RIGHT_X, ry);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MID_TEXT);
    doc.text(expDate, RIGHT_X + RIGHT_W, ry, { align: 'right' });

    ry += lh(9);

    // Company name
    ry = drawText(doc, exp.subtitle, RIGHT_X, ry, RIGHT_W, 8.5, BLUE, 'bold', 1.5);

    // Description lines (lines starting with "-" are indented as bullets;
    // lines matching "- Label: ..." get the label drawn bold)
    if (expDesc) {
      doc.setFontSize(7.5);
      doc.setTextColor(...BODY_TEXT);
      for (const line of expDesc) {
        const isBullet  = line.startsWith('-');
        const indentX   = isBullet ? RIGHT_X + 2 : RIGHT_X;
        const width     = isBullet ? RIGHT_W - 2  : RIGHT_W;
        const boldMatch = line.match(/^(- [^:]+:)(.*)$/);

        if (boldMatch) {
          // Draw bold "- Label:" prefix, then wrap the rest on the same line
          const label  = boldMatch[1];
          const rest   = boldMatch[2];
          doc.setFont('helvetica', 'bold');
          doc.text(label, indentX, ry);
          const labelW = doc.getTextWidth(label);

          doc.setFont('helvetica', 'normal');
          const restLines = doc.splitTextToSize(rest, width - labelW);
          doc.text(restLines[0], indentX + labelW, ry);
          for (let r = 1; r < restLines.length; r++) {
            ry += lh(7.5);
            doc.text(restLines[r], indentX, ry);
          }
          ry += lh(7.5);
        } else {
          doc.setFont('helvetica', 'normal');
          const wrapped = doc.splitTextToSize(line, width);
          doc.text(wrapped, indentX, ry);
          ry += wrapped.length * lh(7.5);
        }
      }
    }

    // Achievements: bold label, then one hanging-indent bullet per item
    if (expAchieved) {
      doc.setFontSize(7.5);
      doc.setTextColor(...BODY_TEXT);
      doc.setFont('helvetica', 'bold');
      doc.text(L.achieved, RIGHT_X, ry);
      ry += lh(7.5);

      doc.setFont('helvetica', 'normal');
      const bulletX = RIGHT_X + 2;
      const textX   = bulletX + doc.getTextWidth('- ');
      for (const item of expAchieved) {
        const wrapped = doc.splitTextToSize(item, RIGHT_X + RIGHT_W - textX);
        doc.text('-', bulletX, ry);
        doc.text(wrapped, textX, ry);
        ry += wrapped.length * lh(7.5);
      }
    }

    ry += 4;
  }

  // ── FOOTER ────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 285, PAGE_W, 12, 'F');
  doc.setFillColor(...BLUE);
  doc.rect(0, 285, 3.5, 12, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 210, 245);
  doc.text('ricardllop.com', MARGIN, 292);

  doc.save('ricard-llop-resume.pdf');
}

// ── Plain (ATS) variant ───────────────────────────────────────────────

/**
 * Draws the single-column, text-only resume into `doc`: black text, no images,
 * sections in reading order, continuing on extra pages when needed.
 */
function drawPlainResume(doc, locale, L) {
  const MARGIN = 18;
  const TOP    = MARGIN + 4;
  const WIDTH  = 210 - MARGIN * 2;
  const BOTTOM = 297 - MARGIN;
  let y = TOP;

  /**
   * Writes wrapped text at the current position, breaking the page line by line.
   * `bullet` draws a hanging "-" before the first line; `url` makes the text a link.
   */
  const write = (text, { size = 10, style = 'normal', gap = 0, bullet = false, url } = {}) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(0, 0, 0);
    const indent = bullet ? 4 : 0;
    doc.splitTextToSize(text, WIDTH - indent).forEach((line, i) => {
      if (y > BOTTOM) {
        doc.addPage();
        y = TOP;
      }
      if (bullet && i === 0) doc.text('-', MARGIN + 1, y);
      if (url) doc.textWithLink(line, MARGIN + indent, y, { url });
      else doc.text(line, MARGIN + indent, y);
      y += lh(size);
    });
    y += gap;
  };

  /** Section heading; moves to a new page rather than sitting alone at the bottom. */
  const heading = (label) => {
    y += 3;
    if (y > BOTTOM - 14) {
      doc.addPage();
      y = TOP;
    }
    write(label, { size: 11, style: 'bold', gap: 1 });
  };

  // Name, title, contact
  write(`${profileData.name} ${profileData.lastName}`, { size: 18, style: 'bold', gap: 1.5 });
  write(profileData.title, { size: 11, style: 'bold', gap: 1 });
  const location = loc(locale, profileData, 'location');
  if (location) write(location);
  const { email, linkedin, github, website } = profileData.contact;
  write(email, { url: `mailto:${email}` });
  for (const link of [linkedin, github, website]) write(link, { url: `https://${link}` });

  // About
  heading(L.about);
  for (const paragraph of loc(locale, profileData, 'description')) {
    write(resolveText(paragraph), { gap: 1.5 });
  }

  // Skills
  heading(L.skills);
  write(profileData.skills.join(', '));

  // Experience
  heading(L.experience);
  for (const exp of profileData.experiences.filter(e => e.type === 'work')) {
    write(loc(locale, exp, 'title'), { size: 10.5, style: 'bold' });
    write(`${exp.subtitle} | ${loc(locale, exp, 'date')}`, { style: 'italic', gap: 1 });
    // "- Label: item, item" stack lines read fine as plain "Label: item, item"
    for (const line of loc(locale, exp, 'description') || []) write(line.replace(/^-\s+/, ''));
    const achieved = loc(locale, exp, 'achievements');
    if (achieved) {
      write(L.achieved, { style: 'bold' });
      for (const item of achieved) write(item, { bullet: true });
    }
    y += 3;
  }

  // Personal Projects
  heading(L.projects);
  for (const project of profileData.projects) {
    write(loc(locale, project, 'title'), { size: 10.5, style: 'bold' });
    write(loc(locale, project, 'description'));
    const link = sitePath(locale, project.link);
    write(link, { url: `https://${link}`, gap: 2 });
  }

  // Certifications
  heading(L.certifications);
  for (const badge of profileData.badges) write(badge.name, { url: badge.url });

  // Education
  heading(L.education);
  for (const exp of profileData.experiences.filter(e => e.type === 'education')) {
    write(loc(locale, exp, 'title'), { size: 10.5, style: 'bold' });
    write(`${exp.subtitle} | ${exp.date}`);
  }

  // Languages
  const languages = loc(locale, profileData, 'languages');
  if (languages) {
    heading(L.languages);
    write(languages.join(', '));
  }
}
