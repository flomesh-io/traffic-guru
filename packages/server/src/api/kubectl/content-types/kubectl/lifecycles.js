"use strict";

const path = require('path');
const os = require('os');
const fs = require('fs');
const KUBE_CONFIG_DIR = path.join(os.tmpdir());
const util = require('util');
const fsOpenAsync = util.promisify(fs.open);
const fsWriteFile = util.promisify(fs.writeFile);
const exec = require('child_process').execSync;
const namespacedCMD = [" get "]
module.exports = {
  beforeCreate: async (event) => {
    const registry = await strapi.db.query("api::registry.registry").findOne({where: {id: event.params.data.registry}, populate: true});
    if (!registry) {
      throw new Error(`Specify a registry`);
    }
    let nsCmd = "";
    let namespaced = false
    for (const cmd of namespacedCMD) {
      if (event.params.data.command.indexOf(cmd) > -1) {
        namespaced  = true;
        break;
      }
    }
    if (namespaced) {
      if (!event.params.data.namespace) {
        nsCmd = " -A"
      } else {
        const namespace = await strapi.db.query("api::namespace.namespace").findOne({where: {id: event.params.data.namespace}, populate: true});
        nsCmd = ` -n ${namespace.name}`
      }
    }

    // kubeconfig ==================
    const kubeconfigPath = path.join(
      KUBE_CONFIG_DIR,
      `${registry.id}.kubeconfig`
    );
    try {
      await fsOpenAsync(kubeconfigPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        if (registry.config) {
          await fsWriteFile(kubeconfigPath, registry.config);
        }
      }
    }
    const cmd = event.params.data.command + nsCmd + ` --kubeconfig ${kubeconfigPath}`
    const result = exec(cmd)
    event.params.data.result = result.toString().replace(/\[.*?\m/g, "")
  },
  
};  