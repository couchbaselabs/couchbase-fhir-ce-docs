import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Couchbase FHIR CE",
  tagline:
    "An Open Source FHIR Server to connect to Couchbase Self Managed or Capella",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  // url: "https://couchbaselabs.github.io",
  url: "https://fhir.couchbase.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "couchbaselabs", // Usually your GitHub org/user name.
  projectName: "couchbase-fhir-ce-docs", // Usually your repo name.
  deploymentBranch: "gh-pages",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          editUrl:
            "https://github.com/couchbaselabs/couchbase-fhir-ce-docs/tree/master/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Couchbase FHIR CE",
      logo: {
        alt: "Couchbase FHIR CE Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://www.couchbase.com/community-license-agreement04272021/",
          position: "left",
          label: "License",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/couchbaselabs/couchbase-fhir-ce",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Documentation",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community Support",
          items: [
            {
              label: "Couchbase Forums",
              href: "https://www.couchbase.com/forums/",
            },
            {
              label: "Discord",
              href: "https://bit.ly/3JGCeUg",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/couchbase",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/couchbaselabs/couchbase-fhir-ce",
            },
            {
              label: "Couchbase",
              href: "https://www.couchbase.com/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Couchbase, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["json", "yaml", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
