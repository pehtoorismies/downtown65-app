/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/modules/**.*'],
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  serverBuildPath: 'build/index.js',
  publicPath: '/build/',
  server: undefined,
  future: {
    v2_routeConvention: true,
    v2_meta: true,
  },
}
