/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/modules/**.*'],
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  serverBuildPath: 'build/index.js',
  publicPath: '/build/',
  serverBuildTarget: 'node-cjs',
  server: undefined,
}
