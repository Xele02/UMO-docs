// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

function filterSidebar(items)
{
  const result = items/*.filter((item) => (item.customProps?.sb_hide) ? false : true)*/.map((item) => 
    { 
      if(item.items != null)
      {
        item.items = item.items.filter((item) => (item.customProps?.sb_hide) ? false : true);
        item.items = filterSidebar(item.items);
      }
      return item; 
  });
  return result;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'UMO Knowledge Base',
  tagline: '',
  favicon: 'data/images/icon.png',

  // Set the production url of your site here
  url: 'https://umo.xele.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          /*async sidebarItemsGenerator({
            defaultSidebarItemsGenerator, ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            return filterSidebar(sidebarItems);
          },*/
        },
        blog: false,
        debug: true,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'UMO Knowledge Base',
        logo: {
          alt: 'UMO logo',
          src: 'data/images/icon.png',
        },
        items: [
          //{
          //  type: 'docSidebar',
          //  sidebarId: 'tutorialSidebar',
          //  position: 'left',
          //  label: 'Tutorial',
          //},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          /*{
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },*/
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/xeT57fyayE',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Xele02/UMO',
              },
              {
                label: 'Weblate',
                href: 'https://umo-translate.xele.org/',
              },
            ],
          },
          /*{
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },*/
        ],
        copyright: `Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  themes: ["docusaurus-json-schema-plugin"],
  plugins: [
    './plugins/umo-generator',
  ],
};

export default config;
