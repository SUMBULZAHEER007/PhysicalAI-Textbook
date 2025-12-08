// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI Textbook',
  tagline: 'AI-native interactive textbook on Physical AI & Humanoid Robotics',
  favicon: 'img/favicon.ico',

  url: 'https://sumbulzaheer007.github.io',
  // LOCAL TESTING KE LIYE baseUrl '/' HONA CHAHIYE
  baseUrl: '/', 

  organizationName: 'SUMBULZAHEER007',
  projectName: 'PhysicalAI-Textbook',

  onBrokenLinks: 'warn',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs', // Ensure docs are served from /docs/
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
      navbar: {
        title: 'Physical AI Textbook',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Chapters',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Sumbul.`,
      },
    }),
};

export default config;