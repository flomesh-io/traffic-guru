'use strict';

/**
 * website controller
 */
const { createCoreController } = require('@strapi/strapi').factories;

const fs = require('fs');
const child_process = require('child_process');
const compressing = require('compressing');

const tmpPath = '/tmp/';

module.exports = createCoreController('api::website.website', {
  async download(args) {
    const os = args.os;
    const id = args.id;
    const website = await strapi.db
      .query('api::website.website')
      .findOne({ where: { id }, populate: true });
    if (!website) return;
    const tempBase = tmpPath + website.domain;

    try {
      fs.statSync(tempBase);
      strapi.log.info('The directory already exists. Delete it');
      fs.rmdirSync(tempBase, { recursive: true });
    } catch {}
    fs.mkdirSync(tempBase);

    child_process.spawnSync('cp', ['-rfp', process.cwd() + '/config/website/template/bin', tempBase]);
    child_process.spawnSync('cp', ['-rfp', process.cwd() + '/config/website/template/pjs', tempBase]);
    child_process.spawnSync('cp', ['-rfp', process.cwd() + '/config/website/template/scerets', tempBase]);
    child_process.spawnSync('cp', ['-rfp', process.cwd() + '/config/website/template/www', tempBase]);
    console.log(['-rfp', process.cwd() + '/config/website/template/*', tempBase])

    child_process.spawnSync('cp', ['-rfp', process.cwd() + '/config/website/pipybin/' + os + "/pipy", tempBase + "/bin/"]);
    console.log(['-rfp', process.cwd() + '/config/website/pipybin/' + os + "/pipy", tempBase + "/bin/"])
    strapi.log.info(process.cwd() + '/config/website/pipybin/' + os + "/pipy ; " + tempBase + "/bin/")
   
    if (website.tlsEnabled) {
      fs.writeFileSync(
        tempBase + '/scerets/tls.key',
        website.certificate.content.key
      );
      fs.writeFileSync(
        tempBase + '/scerets/tls.crt',
        website.certificate.content.cert
      );
    }

    const endpoints = {};
    endpoints[`${website.domain}/*`] = {
      route: website.domain,
    };
    const upstreams = {}
    for (const provider of website.providers) {
        endpoints[`${website.domain}${provider.path}`] = {
            route: provider.path,
            rewrite: provider.rewritePath ? [`^${provider.path}/?`, provider.newPath] : undefined
        };
        upstreams[provider.path] = {
            policy: provider.algo,
            targets: provider.hosts,
          }
    }
    const serveFiles = {}
    serveFiles[website.domain] = {
        root: '../www',
      }

    const config = {
      listen: website.port,
      listenTLS: website.tlsEnabled ? website.tlsPort : undefined,
      plugins: [
        'plugins/router.js',
        'plugins/balancer.js',
        'plugins/serve-files.js',
        'plugins/default.js',
      ],
      endpoints,
      upstreams,
      'serve-files': serveFiles,
      mime: website.mimeType,
    };

    fs.writeFileSync(
        tempBase + '/pjs/config.json',
        JSON.stringify(config, null, 2)
      );
    
    fs.rmSync(tempBase + '/www/.gitkeep');
    if (website.resource && website.resource.length) {
        const zip = process.cwd() + "/public" + website.resource[0].url
        strapi.log.info(zip, process.cwd() + '/www/')
        await compressing.zip.uncompress(zip, tempBase + '/www/')
        strapi.log.info(zip, process.cwd() + '/www/')
    }
    await compressing.zip.compressDir(tempBase, process.cwd() + "/public/download/website-" + website.domain + ".zip")

    return "/download/website-" + website.domain + ".zip";
  },
});
