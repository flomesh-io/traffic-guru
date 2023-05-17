'use strict';

/**
 * website controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = createCoreController('api::website.website', {
    async download() {
        await sleep(3000)
        return "/download/osm-smi-yaml.zip"
    }
});
