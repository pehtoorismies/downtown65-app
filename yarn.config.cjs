// @ts-check

/** @type {import("@yarnpkg/types")} */
const { defineConfig } = require('@yarnpkg/types')

const versions = require('./installed-dependencies.json')

function enforce(pkg, version, Yarn) {
  for (const dep of Yarn.dependencies({ ident: pkg })) {
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
  for (const [pkg, version] of Object.entries(versions)) {
    enforce(pkg, version, Yarn)
  }
}

module.exports = defineConfig({
  constraints: async (ctx) => {
    enforceSameVersion(ctx)
  },
})
