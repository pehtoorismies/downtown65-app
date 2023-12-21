/** @type {import("@remix-run/dev").AppConfig} */
export default {
  // check ignoredRouteFiles https://docs.sst.dev/constructs/RemixSite
  ignoredRouteFiles: ['**/.*'],
  postcss: true,
  serverDependenciesToBundle: [/^date-fns.*/, /^dayjs.*/],
  // serverModuleFormat: 'esm',
  // serverModuleFormat: "cjs",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
}
