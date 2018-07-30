const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');

const configsDir = path.normalize(path.join(process.env.PWD, 'static-store'));

class StaticStoreModule {
  constructor(configPath) {
    this._configPath = configPath;
  }

  get(name) {
    return this.getOrDefault(name, undefined);
  }

  getOrFail(name) {
    const result = this[name];
    if (result === undefined) {
      throw new Error(`Key ${name} not found in ${this._configPath}`);
    }
    return result;
  }

  getOrDefault(name, defaultValue) {
    const result = this[name];
    if (result === undefined) {
      return defaultValue;
    }
    return result;
  }
}

function loadObjectForProp(name) {
  const kebabName = _.kebabCase(name);
  const configPath = getConfigPath(kebabName);
  if (!fs.existsSync(configPath)) {
    throw new Error(`No configuration for ${name} (${configPath})`);
  }
  const fileContents = fs.readFileSync(configPath, {encoding: 'utf-8'});
  const yamlContent = yaml.safeLoad(fileContents);
  const result = Object.assign(new StaticStoreModule(configPath), yamlContent);
  return Object.freeze(result); // TODO deeply freeze it for bonus points
}

function getConfigPath(filename) {
  return path.join(configsDir, `${filename}.yaml`);
}

/**
 * An object which will contain a representation of the files in the directory
 * `other-config`.
 *
 * Example use: require('./extra-config').iceCreamFlavor[1] // returns 'VANILLA'
 *
 * The above example will look for the file
 * `extra-config/ice-cream-flavor.yaml`.
 *
 * Results are cached.
 */
const StaticStore = new Proxy({}, {
  get: (target, name) => {
    if (!this[name]) {
      this[name] = loadObjectForProp(name);
    }
    return this[name];
  }
});

module.exports = StaticStore;
