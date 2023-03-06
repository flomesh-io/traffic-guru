"use strict";

const path = require('path');
const os = require('os');
const fs = require('fs');
const KUBE_CONFIG_DIR = path.join(os.tmpdir());
const util = require('util');
const fsOpenAsync = util.promisify(fs.open);
const fsWriteFile = util.promisify(fs.writeFile);
const exec = require('child_process').execSync;

module.exports = {
  beforeCreate: async (event) => {
    const namespace = await strapi.db.query("api::namespace.namespace").findOne({where: {id: event.params.data.namespace}, populate: true});
    if (!namespace) {
      throw new Error(`Specify a registry`);
    }

    // kubeconfig ==================
    const kubeconfigPath = path.join(
      KUBE_CONFIG_DIR,
      `${namespace.registry.id}.kubeconfig`
    );
    try {
      await fsOpenAsync(kubeconfigPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        if (namespace.registry.config) {
          await fsWriteFile(kubeconfigPath, namespace.registry.config);
        }
      }
    }
    // yaml
    const yamlPath = path.join(
      KUBE_CONFIG_DIR,
      `${new Date().getTime()}.yaml`
    );
    try {
      await fsOpenAsync(yamlPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fsWriteFile(yamlPath, event.params.data.yaml);
      }
    }
    const cmd = `kubectl apply -f ${yamlPath} --kubeconfig ${kubeconfigPath} -n ${namespace.name}`
    try {
      const result = exec(cmd)
      event.params.data.result = result.toString("utf8")
    } catch (error) {
      throw new Error(error.message.split(":")[error.message.split(":").length -1]);
    }
  },
  
};  