module.exports = {
  register() {},
  bootstrap({ strapi }) {
    strapi.log.info("[auto-save] Plugin bootstrapped");
  },
};
