export const ActiveUsers = (function () {
  function Singleton(options = {}) {
    this.user_ids = {};
    this.logoutTimeouts = {};

    this.getAll = () => this.user_ids;

    this.getCount = (): number => Object.keys(this.user_ids).length;

    this.add = (user_id: string) => {
      this.user_ids[user_id] = 1;
      this.setLogoutTimeout(user_id);
    };

    this.setLogoutTimeout = (id: string, time: number = 60000) => {
      if (this.logoutTimeouts[id]) clearTimeout(this.logoutTimeouts[id]);
      let timeout = setTimeout(() => delete this.user_ids[id], time);
      this.logoutTimeouts[id] = timeout;
    };

    this.isUserActive = (id: string): boolean => Boolean(this.user_ids[id]);
  }

  let instance;
  const getInstance = (options = {}) => {
    if (!instance) instance = new Singleton(options);
    return instance;
  };

  return getInstance();
})();
