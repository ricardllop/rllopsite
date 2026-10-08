import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import profileData from '@site/src/data/profile.json';
import { downloadResume } from '@site/src/utils/generateResume';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const yearsExp = new Date().getFullYear() - profileData.careerStartYear;
const resolveText = (text) => text.replace('{yearsExp}', yearsExp);

// Returns the _es variant of a field when locale is 'es', falls back to base field
const loc = (locale, obj, key) => {
  const esKey = `${key}_es`;
  return locale === 'es' && obj[esKey] ? obj[esKey] : obj[key];
};

const UI = {
  en: {
    greeting: (name) => `Hello, I am ${name}`,
    downloadResume: 'Download Resume',
    downloadPlain: 'Plain version (ATS-friendly)',
    terminalCmd: 'Click to view the infrastructure and CICD behind this site',
    exploreArch: 'Explore the architecture',
    experience: 'Experience',
    achieved: 'Achieved:',
    projects: 'Personal projects',
    readMore: 'Read more',
  },
  es: {
    greeting: (name) => `Hola, soy ${name}`,
    downloadResume: 'Descargar CV',
    downloadPlain: 'Versión simple (para ATS)',
    terminalCmd: 'Ver la infraestructura y CI/CD detrás de este sitio',
    exploreArch: 'Explorar la arquitectura',
    experience: 'Experiencia',
    achieved: 'Logros:',
    projects: 'Proyectos personales',
    readMore: 'Leer más',
  },
};

const CONTACT_ICONS = {
  email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  github: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z',
};

function ContactLinks() {
  const { email, linkedin, github } = profileData.contact;
  const links = [
    { key: 'email', label: 'Email', href: `mailto:${email}` },
    { key: 'linkedin', label: 'LinkedIn', href: `https://${linkedin}`, external: true },
    { key: 'github', label: 'GitHub', href: `https://${github}`, external: true },
  ];
  return (
    <div className={styles.contactRow}>
      {links.map(({ key, label, href, external }) => (
        <a
          key={key}
          href={href}
          className={styles.contactLink}
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          <svg viewBox="0 0 24 24" className={styles.resumeIcon} aria-hidden="true">
            <path d={CONTACT_ICONS[key]} />
          </svg>
          {label}
        </a>
      ))}
    </div>
  );
}

function HomepageHeader({ locale }) {
  const { siteConfig } = useDocusaurusContext();
  const ui = UI[locale] || UI.en;
  const description = loc(locale, profileData, 'description');
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col', styles.heroContent)}>
            <div className="descriptiontext">
              <h1 className={styles.nameHeading}>{ui.greeting(`${profileData.name} ${profileData.lastName}`)}</h1>
              <h2 className={styles.roleTitle}>{profileData.title}</h2>
              {description.map((paragraph, index) => (
                <p key={index} className={index < description.length - 1 ? 'pmid' : ''}>
                  {resolveText(paragraph)}
                </p>
              ))}
            </div>
            <div className={styles.badgesSection}>
              {profileData.badges.map((badge, index) => (
                <a key={index} href={badge.url}>
                  <img src={badge.image} alt={badge.alt} className="badgeimage" />
                </a>
              ))}
            </div>
          </div>
          <div className={clsx('col', 'profileimg-container', styles.heroImageCol)}>
            <div className={styles.profileImgWrapper}>
              <img src={profileData.profileImage.src} alt={profileData.profileImage.alt} className="profileimg" />
            </div>
            <ContactLinks />
            <button onClick={() => downloadResume(locale)} className={styles.resumeButton}>
              <svg viewBox="0 0 24 24" className={styles.resumeIcon} aria-hidden="true">
                <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4v-2h14v2H5z"/>
              </svg>
              {ui.downloadResume}
            </button>
            <button onClick={() => downloadResume(locale, { plain: true })} className={styles.plainResumeLink}>
              {ui.downloadPlain}
            </button>
            <div>
              <Link to={profileData.learnMoreLink.url} className={styles.terminalLink}>
                <div className={styles.terminalArrowHint} aria-hidden="true">
                  <span className={styles.terminalHintLabel}>EXPLORE</span>
                  <span className={styles.cmdArrow}>▶</span>
                </div>
                <div className={styles.terminalCard}>
                  <div className={styles.terminalBar}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.terminalTitle}>rllopsite.infra</span>
                    <span className={styles.liveTag}>
                      <span className={styles.livePulse} />
                      LIVE
                    </span>
                  </div>
                  <div className={styles.terminalBody}>
                    <div className={styles.cmdLine}>
                      <span className={styles.cmdPrompt}>$</span>
                      <span className={styles.cmd}>{ui.terminalCmd}</span>
                    </div>
                    <div className={styles.pipeline}>
                      <span className={styles.stage}>BUILD ✓</span>
                      <span className={styles.pipeArrow}>──▶</span>
                      <span className={styles.stage}>PUSH ✓</span>
                      <span className={styles.pipeArrow}>──▶</span>
                      <span className={styles.stage}>DEPLOY ✓</span>
                    </div>
                    <div className={styles.deployedImage}>
                      <span className={styles.deployedImageLabel}>image</span>
                      rllopsite:{siteConfig.customFields.imageTag}
                    </div>
                    <div className={styles.techRow}>
                      {['K8s', 'OCI', 'Terraform', 'ArgoCD', 'Docker'].map(t => (
                        <span key={t} className={styles.techPill}>{t}</span>
                      ))}
                    </div>
                    <div className={styles.cta}>
                      {ui.exploreArch}
                      <span className={styles.ctaArrow}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const WorkIcon = () => (
  <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

const EducationIcon = () => (
  <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
  </svg>
);

function DescStack({ label, items }) {
  return (
    <div className={styles.descStack}>
      <span className={styles.descStackLabel}>{label}</span>
      <div className={styles.descStackPills}>
        {items.map((item, i) => (
          <span key={i} className={styles.descStackPill}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function renderDescBlock(line, i) {
  // "- Label: item1, item2, ..." → labeled tech-stack pills
  const stackMatch = line.match(/^-\s+([^:]+):\s*(.+)$/);
  if (stackMatch) {
    const label = stackMatch[1].trim();
    const items = stackMatch[2].replace(/\.$/, '').split(',').map(s => s.trim()).filter(Boolean);
    return <DescStack key={i} label={label} items={items} />;
  }
  // default → prose paragraph
  return <p key={i} className={styles.descProse}>{line}</p>;
}

function Achievements({ label, items }) {
  return (
    <div className={styles.achieved}>
      <strong className={styles.achievedLabel}>{label}</strong>
      <ul className={styles.achievedList}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Experience({ locale }) {
  const ui = UI[locale] || UI.en;
  return (
    <div id="experience" className={styles.experienceSection}>
      <div className={styles.sectionHeader}>
        <h2>{ui.experience}</h2>
      </div>
      <VerticalTimeline lineColor='var(--ifm-color-primary)'>
        {profileData.experiences.map((exp, index) => {
          const title = loc(locale, exp, 'title');
          const date = loc(locale, exp, 'date');
          const description = loc(locale, exp, 'description');
          const achievements = loc(locale, exp, 'achievements');
          return (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
              contentArrowStyle={{ borderRight: '30px solid var(--ifm-color-primary-lightest)' }}
              date={date}
              dateClassName="contrastWithBackground"
              shadowSize="large"
              iconStyle={{
                background: exp.type === 'work' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-primary-lighter)',
                color: '#fff'
              }}
              icon={exp.type === 'work' ? <WorkIcon /> : <EducationIcon />}
            >
              <h3 className="vertical-timeline-element-title">{title}</h3>
              <h4 className="vertical-timeline-element-subtitle">{exp.subtitle}</h4>
              {description && (
                <div className={styles.descBlock}>
                  {description.map((line, i) => renderDescBlock(line, i))}
                </div>
              )}
              {achievements && <Achievements label={ui.achieved} items={achievements} />}
            </VerticalTimelineElement>
          );
        })}
        <VerticalTimelineElement
          shadowSize="large"
          iconStyle={{ background: 'rgb(53 146 86)', color: '#fff' }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
              <path d="M20.492,7.969,10.954.975A5,5,0,0,0,3,5.005V19a4.994,4.994,0,0,0,7.954,4.03l9.538-6.994a5,5,0,0,0,0-8.062Z" />
            </svg>
          }
        />
      </VerticalTimeline>
    </div>
  );
}

function Projects({ locale }) {
  const ui = UI[locale] || UI.en;
  return (
    <div id="projects" className={styles.projectsSection}>
      <div className={styles.sectionHeader}>
        <h2>{ui.projects}</h2>
      </div>
      <div className={clsx('container', styles.projectsGrid)}>
        {profileData.projects.map((project, index) => (
          <Link key={index} to={project.link} className={styles.projectCard}>
            <h3>{loc(locale, project, 'title')}</h3>
            <p>{loc(locale, project, 'description')}</p>
            <span className={styles.projectCta}>
              {ui.readMore}
              <span className={styles.ctaArrow}>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig, i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const pageTitle = `${siteConfig.title} | ${siteConfig.tagline}`;
  return (
    <Layout description={resolveText(loc(locale, profileData, 'description')[0])}>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
      </Head>
      <HomepageHeader locale={locale} />
      <div className={styles.sectionDivider} />
      <main>
        <Experience locale={locale} />
        <Projects locale={locale} />
      </main>
    </Layout>
  );
}
