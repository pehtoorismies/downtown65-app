import { Honeypot } from 'remix-utils/honeypot/server'
import { Config } from 'sst/node/config'

// Create a new Honeypot instance, the values here are the defaults, you can
// customize them
export const honeypot = new Honeypot({
  randomizeNameFieldName: false,
  nameFieldName: 'name__confirm',
  validFromFieldName: 'from__confirm', // null to disable it
  encryptionSeed: Config.HONEYPOT_SECRET, // Ideally it should be unique even between processes
})
