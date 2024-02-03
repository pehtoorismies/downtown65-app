// @ts-check

/** @type {import("@yarnpkg/types")} */
const { defineConfig } = require(`@yarnpkg/types`)

const versions = require('./installed-dependencies.json')

function enforce(package, version, Yarn) {
  for (const dep of Yarn.dependencies({ ident: package })) {
    dep.update(version)
  }
}

/**
 * This rule will enforce that a workspace MUST have same version of
 * a dependency.
 *
 * @param {Context} context
 */
function enforceSameVersion({ Yarn }) {
  for (const [package, version] of Object.entries(versions)) {
    enforce(package, version, Yarn)
  }
}

module.exports = defineConfig({
  constraints: async (ctx) => {
    enforceSameVersion(ctx)
  },
})
