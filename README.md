# theonetruedaniel.github.io
Daniel Abrams portfolio — RevOps case studies, interactive demos, AI architecture and verified credentials.

## Check the architecture catalog

[![Architecture catalog checks](https://github.com/theonetruedaniel/theonetruedaniel.github.io/actions/workflows/catalog.yml/badge.svg)](https://github.com/theonetruedaniel/theonetruedaniel.github.io/actions/workflows/catalog.yml)

With Node.js 22 or newer, run from the repository root:

```sh
node --test architecture/repository-catalog.test.mjs
```

The eight tests check search and filter behavior, record counts, unique repository destinations, and required evidence fields. They read local catalog data and need no package installation or credentials. GitHub Actions runs them when catalog files or this workflow change.

These checks validate the catalog's internal consistency. They do not re-fetch upstream links, establish candidate adoption, or validate the whole website. The workflow does not deploy the site.

## License

The [MIT License](LICENSE), copyright (c) 2026 Daniel Abrams, applies only to original software code authored by Daniel Abrams in this repository. It does not apply to the résumé (`Daniel_Abrams_GTM_Resume.pdf`), personal biographical and career content, photographs, identity or brand assets, third-party material, or externally linked works. Third-party libraries, generated dependency code and icons retain their respective licenses and notices.
