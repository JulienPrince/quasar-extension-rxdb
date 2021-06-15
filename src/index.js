function extendConf(conf) {
  // register our boot file
  conf.boot.push("~@jdao/quasar-app-extension-plugin-rxdb/src/boot/register.js");
  conf.build.transpileDependencies.push(/quasar-app-extension-rxdb[\\/]src/);
}

const chainWebpack = (ctx, chain) => {
  const path = require("path");
  chain.resolve.alias.set(
    "@sowell/rxdb",
    path.resolve(__dirname, "./rxdb/replication"),
  );
};

module.exports = function (api) {
  api.compatibleWith("quasar", "^2.0.0-beta.1");
  api.compatibleWith("@quasar/app", "^3.0.0-beta.1");
  api.chainWebpack((chain) => chainWebpack(api.ctx, chain));
  api.extendQuasarConf(extendConf);
};
