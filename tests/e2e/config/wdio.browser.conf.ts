import { config as baseConfig, EXTENSION_PATHS } from './wdio.conf.js';
import { getChromeExtensionPath, getFirefoxExtensionPath } from '../utils/extension-path.js';
import { IS_CI, IS_FIREFOX } from '@extension/env';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { ExtensionVariant } from './wdio.conf.js';

const variant = (process.env['MINDFLEX_VARIANT'] ?? 'senior') as ExtensionVariant;
const distZipDir = EXTENSION_PATHS[variant];

const extName = IS_FIREFOX ? '.xpi' : '.zip';
const extensions = await readdir(distZipDir);
const latestExtension = extensions.filter(file => extname(file) === extName).at(-1);
const extPath = join(distZipDir, latestExtension!);
const bundledExtension = (await readFile(extPath)).toString('base64');

const buildChromeCapabilities = (ext: string, label: string) => ({
  browserName: 'chrome',
  acceptInsecureCerts: true,
  'wdio:maxInstances': IS_CI ? 5 : 1,
  'wdio:specs': [`../specs/${label}/**/*.ts`, '../specs/shared/**/*.ts'],
  'goog:chromeOptions': {
    args: [
      '--disable-web-security',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      ...(IS_CI ? ['--headless'] : []),
    ],
    prefs: { 'extensions.ui.developer_mode': true },
    extensions: [ext],
  },
});

const buildFirefoxCapabilities = () => ({
  browserName: 'firefox',
  acceptInsecureCerts: true,
  'moz:firefoxOptions': { args: [...(IS_CI ? ['--headless'] : [])] },
});

const chromeCapabilities = IS_FIREFOX
  ? [buildFirefoxCapabilities()]
  : [buildChromeCapabilities(bundledExtension, variant)];

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: chromeCapabilities,
  maxInstances: IS_CI ? 10 : 1,
  logLevel: 'error',
  execArgv: IS_CI ? [] : ['--inspect'],
  before: async ({ browserName }: WebdriverIO.Capabilities, _specs, browser: WebdriverIO.Browser) => {
    if (browserName === 'firefox') {
      await browser.installAddOn(bundledExtension, true);
      browser.addCommand('getExtensionPath', async () => getFirefoxExtensionPath(browser));
    } else if (browserName === 'chrome') {
      browser.addCommand('getExtensionPath', async () => getChromeExtensionPath(browser));
    }
  },
  afterTest: async () => {
    if (!IS_CI) await browser.pause(500);
  },
};
