<p align="center">
  <a href="https://strapi.io/#gh-light-mode-only">
    <img src="https://strapi.io/assets/strapi-logo-dark.svg" width="318px" alt="Strapi logo" />
  </a>
  <a href="https://strapi.io/#gh-dark-mode-only">
    <img src="https://strapi.io/assets/strapi-logo-light.svg" width="318px" alt="Strapi logo" />
  </a>
</p>

<h3 align="center">API creation made simple, secure and fast.</h3>
<p align="center">The most advanced open-source headless CMS to build powerful APIs with no effort.</p>
<p align="center"><a href="https://strapi.io/demo">Try live demo</a></p>
<br />

<p align="center">
  <a href="https://www.npmjs.org/package/@strapi/strapi">
    <img src="https://img.shields.io/npm/v/@strapi/strapi/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://github.com/strapi/strapi/actions/workflows/tests.yml">
    <img src="https://github.com/strapi/strapi/actions/workflows/tests.yml/badge.svg?branch=main" alt="Tests" />
  </a>
  <a href="https://discord.strapi.io">
    <img src="https://img.shields.io/discord/811989166782021633?label=Discord" alt="Strapi on Discord" />
  </a>
  <a href="https://github.com/strapi/strapi/actions/workflows/nightly.yml">
    <img src="https://github.com/strapi/strapi/actions/workflows/nightly.yml/badge.svg" alt="Strapi Nightly Release Build Status" />
  </a>
</p>

<br>

<p align="center">
  <a href="https://strapi.io">
    <img src="https://raw.githubusercontent.com/strapi/strapi/0bcebf77b37182fe021cb59cc19be8f5db4a18ac/public/assets/administration_panel.png" alt="Administration panel" />
  </a>
</p>

<br>

Strapi is a free and open-source headless CMS delivering your content anywhere you need.

- **Keep control over your data**. With Strapi, you know where your data is stored, and you keep full control at all times.
- **Self-hosted**. You can host and scale Strapi projects the way you want. You can choose any hosting platform you want: AWS, Render, Netlify, Heroku, a VPS, or a dedicated server. You can scale as you grow, 100% independent.
- **Database agnostic**. Strapi works with SQL databases. You can choose the database you prefer: PostgreSQL, MySQL, MariaDB, and SQLite.
- **Customizable**. You can quickly build your logic by fully customizing APIs, routes, or plugins to fit your needs perfectly.

## Getting Started

<a href="https://docs.strapi.io/developer-docs/latest/getting-started/quick-start.html" target="_blank">Read the Getting Started tutorial</a> or follow the steps below:

### ⏳ Installation

Install Strapi with this **Quickstart** command to create a Strapi project instantly:

- (Use **yarn** to install the Strapi project (recommended). [Install yarn with these docs](https://yarnpkg.com/lang/en/docs/install/).)

```bash
yarn create strapi-app my-project --quickstart
```

**or**

- (Use npm/npx to install the Strapi project.)

```bash
npx create-strapi-app my-project --quickstart
```

This command generates a brand new project with the default features (authentication, permissions, content management, content type builder & file upload). The **Quickstart** command installs Strapi using a **SQLite** database which is used for prototyping in development.

Enjoy 🎉

### 🖐 Requirements

Complete installation requirements can be found in the documentation under <a href="https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html">Installation Requirements</a>.

**Supported operating systems**:

- Ubuntu LTS/Debian 9.x
- CentOS/RHEL 8
- macOS Mojave
- Windows 10
- Docker

(Please note that Strapi may work on other operating systems, but these are not tested nor officially supported at this time.)

**Node:**

Strapi only supports maintenance and LTS versions of Node.js. Please refer to the <a href="https://nodejs.org/en/about/releases/">Node.js release schedule</a> for more information. NPM versions installed by default with Node.js are supported. Generally it's recommended to use yarn over npm where possible.

| Strapi Version | Recommended | Minimum |
| -------------- | ----------- | ------- |
| 4.3.9 and up   | 18.x        | 14.x    |
| 4.0.x to 4.3.8 | 16.x        | 14.x    |

**Database:**

| Database   | Recommended | Minimum |
| ---------- | ----------- | ------- |
| MySQL      | 8.0         | 5.7.8   |
| MariaDB    | 10.6        | 10.3    |
| PostgreSQL | 14.0        | 11.0    |
| SQLite     | 3           | 3       |

**We recommend always using the latest version of Strapi stable to start your new projects**.

## Features

- **Modern Admin Panel:** Elegant, entirely customizable and a fully extensible admin panel.
- **Secure by default:** Reusable policies, CORS, CSP, P3P, Xframe, XSS, and more.
- **Plugins Oriented:** Install the auth system, content management, custom plugins, and more, in seconds.
- **Blazing Fast:** Built on top of Node.js, Strapi delivers amazing performance.
- **Front-end Agnostic:** Use any front-end framework (React, Vue, Angular, etc.), mobile apps or even IoT.
- **Powerful CLI:** Scaffold projects and APIs on the fly.
- **SQL databases:** Works with PostgreSQL, MySQL, MariaDB, and SQLite.

**[See more on our website](https://strapi.io/overview)**.

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request to the project.

## Community support

For general help using Strapi, please refer to [the official Strapi documentation](https://docs.strapi.io). For additional help, you can use one of these channels to ask a question:

- [Discord](https://discord.strapi.io) (For live discussion with the Community and Strapi team)
- [GitHub](https://github.com/strapi/strapi) (Bug reports, Contributions)
- [Community Forum](https://forum.strapi.io) (Questions and Discussions)
- [Feedback section](https://feedback.strapi.io) (Roadmap, Feature requests)
- [Twitter](https://twitter.com/strapijs) (Get the news fast)
- [Facebook](https://www.facebook.com/Strapi-616063331867161)
- [YouTube Channel](https://www.youtube.com/strapi) (Learn from Video Tutorials)

## Migration

Follow our [migration guides](https://docs.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html) on the documentation to keep your projects up-to-date.

## Roadmap

Check out our [roadmap](https://feedback.strapi.io) to get informed of the latest features released and the upcoming ones. You may also give us insights and vote for a specific feature.

## Documentation

See our dedicated [repository](https://github.com/strapi/documentation) for the Strapi documentation, or view our documentation live:

- [Developer docs](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html)
- [User guide](https://docs.strapi.io/user-docs/latest/getting-started/introduction.html)

## Try live demo

See for yourself what's under the hood by getting access to a [hosted Strapi project](https://strapi.io/demo) with sample data.

## License

See the [LICENSE](./LICENSE) file for licensing information.
