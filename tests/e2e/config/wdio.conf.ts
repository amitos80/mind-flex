import { join } from 'node:path';

/** Resolved paths for built extension zips, relative to the monorepo root. */
export const EXTENSION_PATHS = {
  senior: join(import.meta.dirname, '../../../dist-zip/senior'),
  junior: join(import.meta.dirname, '../../../dist-zip/junior'),
} as const;

export type ExtensionVariant = keyof typeof EXTENSION_PATHS;

/**
 * WebdriverIO v9 configuration file
 * https://webdriver.io/docs/configurationfile
 */
export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: '../tsconfig.json',

  specs: ['../specs/**/*.ts'],
  exclude: [],

  maxInstances: 10,

  // Populated per variant in wdio.browser.conf.ts
  capabilities: [],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
