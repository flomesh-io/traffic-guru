import favicon from './extensions/logo_strapi.png';

export default {
  config: {
    // replace favicon with a custom icon
    auth: {
      logo: favicon,
      menu: favicon
    }
  }
}