// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI Textbook',
  tagline: 'AI-native interactive textbook on Physical AI & Humanoid Robotics',
  favicon: 'img/favicon.ico',

  // 1. GitHub User URL
  url: 'https://sumbulzaheer007.github.io', 
  
  // 2. IMPORTANT: Repository ka naam baseUrl mein hona chahiye deployment ke liye
  baseUrl: '/PhysicalAI-Textbook/', 

  organizationName: 'SUMBULZAHEER007',
  projectName: 'PhysicalAI-Textbook',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs', // /docs/intro etc.
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
        copyright: `Copyright © ${new Date().getFullYear()} Sumbul Zaheer. AI-Native Physical AI Textbook.`,
      },
    }),
};

export default config;