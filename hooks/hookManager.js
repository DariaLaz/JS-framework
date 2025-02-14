/**
 * Singleton class to manage hooks
 * @class hookManager
 *
 */
class hookManager {
  constructor() {
    if (!hookManager.instance) {
      this.hooks = [];
      hookManager.instance = this;
    }
    return hookManager.instance;
  }

  /**
   * Adds a new hook to the hook manager
   * @param {Effect} hook
   */
  addHook(hook) {
    this.hooks.push(hook);
  }

  /**
   * Runs all hooks in the hook manager
   */
  runHooks() {
    console.log("Running hooks", this.hooks);
    if (this.hooks) {
      this.hooks.forEach((hook) => {
        hook.use();
      });
    }
  }
}

module.exports = new hookManager();
