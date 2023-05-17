'use strict';

const _ = require('lodash');
const { getCommonPath } = require('./string-formatting');

const getConfigUrls = (config, forAdminBuild = false) => {
  const serverConfig = config.get('server');
  const adminConfig = config.get('admin');

  // Defines serverUrl value
  let serverUrl = _.get(serverConfig, 'url', '');
  serverUrl = _.trim(serverUrl, '/ ');
  if (typeof serverUrl !== 'string') {
    throw new Error('Invalid server url config. Make sure the url is a string.');
  }
  if (serverUrl.startsWith('http')) {
    try {
      serverUrl = _.trim(new URL(serverConfig.url).toString(), '/');
    } catch (e) {
      throw new Error(
        'Invalid server url config. Make sure the url defined in server.js is valid.'
      );
    }
  } else if (serverUrl !== '') {
    serverUrl = `/${serverUrl}`;
  }

  // Defines adminUrl value
  let adminUrl = _.get(adminConfig, 'url', '/admin');
  adminUrl = _.trim(adminUrl, '/ ');
  if (typeof adminUrl !== 'string') {
    throw new Error('Invalid admin url config. Make sure the url is a non-empty string.');
  }
  if (adminUrl.startsWith('http')) {
    try {
      adminUrl = _.trim(new URL(adminUrl).toString(), '/');
    } catch (e) {
      throw new Error('Invalid admin url config. Make sure the url defined in server.js is valid.');
    }
  } else {
    adminUrl = `${serverUrl}/${adminUrl}`;
  }

  // Defines adminPath value
  let adminPath = adminUrl;
  if (
    serverUrl.startsWith('http') &&
    adminUrl.startsWith('http') &&
    new URL(adminUrl).origin === new URL(serverUrl).origin &&
    !forAdminBuild
  ) {
    adminPath = adminUrl.replace(getCommonPath(serverUrl, adminUrl), '');
    adminPath = `/${_.trim(adminPath, '/')}`;
  } else if (adminUrl.startsWith('http')) {
    adminPath = new URL(adminUrl).pathname;
  }

  return {
    serverUrl,
    adminUrl,
    adminPath,
  };
};

const getAbsoluteUrl =
  (adminOrServer) =>
  (config, forAdminBuild = false) => {
    const { serverUrl, adminUrl } = getConfigUrls(config, forAdminBuild);
    const url = adminOrServer === 'server' ? serverUrl : adminUrl;

    if (url.startsWith('http')) {
      return url;
    }

    const hostname =
      config.get('environment') === 'development' &&
      ['127.0.0.1', '0.0.0.0'].includes(config.get('server.host'))
        ? 'localhost'
        : config.get('server.host');

    return `http://${hostname}:${config.get('server.port')}${url}`;
  };

module.exports = {
  getConfigUrls,
  getAbsoluteAdminUrl: getAbsoluteUrl('admin'),
  getAbsoluteServerUrl: getAbsoluteUrl('server'),
};
