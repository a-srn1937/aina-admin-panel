import { CONFIG } from 'src/global-config';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | صفحه پیدا نشد` };

export default function Page() {
  return <NotFoundView />;
}
