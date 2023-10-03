/** @type {import("@remix-run/dev").AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  postcss: true,
  serverDependenciesToBundle: [
    /^date-fns.*/,
    /^dayjs.*/,
    /^@mantine\/dropzone.*/,
    'react-dropzone',
  ],
  // serverModuleFormat: 'esm',
  // serverModuleFormat: "cjs",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
}
