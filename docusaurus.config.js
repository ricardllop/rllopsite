import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'RLlop Site',
  tagline: 'Devops Engineer',
  favicon: 'img/favicon.ico',

  // TO DO Set the production url of your site here
  url: 'https://todo.com',
  baseUrl: '/',
  organizationName: 'ricardllop',
  projectName: 'rllopsite',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/ricardllop/rllopsite',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/ricardllop/rllopsite',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/devops.png',
      navbar: {
        title: 'Me',
        logo: {
          alt: 'My Site Logo',
          src: 'img/sitelogo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'How is this hosted',
          },
          {to: '/blog', label: 'Portfolio', position: 'left'},
          {
            href: 'https://github.com/ricardllop',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'How is this hosted',
                to: '/docs/intro',
              },
              {
                label: 'Portfolio',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/in/ricard-llop-palou-devops/',
              },
              {
                label: 'Mail',
                href: 'mailto:ricardlloppalou@gmail.com',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ricardllop',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} RLlopSite, Inc. Built with React.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
