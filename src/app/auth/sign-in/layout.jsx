import { CONFIG } from 'src/global-config';
import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: {
            title: 'پنل مدیریت آینا',
            // subtitle: 'همراهی هوشمند برای مدیریت کارآمدتر هیئت مدیره',
            imgUrl: '/assets/illustrations/illustration-sign-in.svg',
          },
        }}
      >
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
