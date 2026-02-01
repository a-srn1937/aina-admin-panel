import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const UI_CONFIG = {
  workspaces: false,
  helpLink: false,
  localization: false,
  notification: false,
  searchbar: false,
  contacts: false,
  settings: false,
  account: true,
  mobileOnly: false,
};

export const CONFIG = {
  appName: 'Aina Admin',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://api.aina.vision/api',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? 'https://api.aina.vision',
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
  /**
   * Auth
   * @method jwt
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
};
