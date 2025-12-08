// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI Textbook',
  tagline: 'AI-native interactive textbook on Physical AI & Humanoid Robotics',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://sumbulzaheer007.github.io',
  baseUrl: '/PhysicalAI-Textbook/',

  organizationName: 'SUMBULZAHEER007',
  projectName: 'PhysicalAI-Textbook',

  onBrokenLinks: 'warn',

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
            'https://github.com/SUMBULZAHEER007/PhysicalAI-Textbook/tree/main/physical-ai-book/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Physical AI Textbook',
        logo: {
          alt: 'Physical AI Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Chapters',
          },
          {
            href: 'https://github.com/SUMBULZAHEER007/PhysicalAI-Textbook',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'About the Author',
            items: [
              {
                label: 'Connect on LinkedIn',
                href: 'https://www.linkedin.com/in/sumbulzaheer001/', 
              },
            ],
          },
          {
            title: 'Textbook Resources',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Explore Chapters',
                to: '/docs/',
              },
            ],
          },
          {
            title: 'Project Links',
            items: [
              {
                label: 'GitHub Repo',
                href: 'https://github.com/SUMBULZAHEER007/PhysicalAI-Textbook',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Sumbul. AI-Native Physical AI Textbook.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;