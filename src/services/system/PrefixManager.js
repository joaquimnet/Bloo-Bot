const Collection = require('@discordjs/collection');

const logger = require('../logger');

module.exports = class PrefixManage extends Collection {
  constructor(client) {
    super();
    this.client = client;
  }

  loadMany(prefixes) {
    if (!Array.isArray(prefixes)) {
      logger.error('[PrefixManager] Could not load prefixes because "prefixes" is not an array.', prefixes);
      return;
    }
    prefixes.forEach(p => this.set(p[0], p[1]));
  }

  loadOne(id, prefix) {
    this.set(id, prefix);
  }

  unloadMany(ids) {
    this.sweep((v, k) => ids.includes(k));
  }

  unloadOne(id) {
    this.delete(id);
  }

}