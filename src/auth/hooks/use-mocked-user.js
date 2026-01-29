import { _mock } from 'src/_mock';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------
export const ORGANIZATION_TYPES = {
  organization: 'شرکت',
  committee: 'کمیته',
};

export const mockedCommittees = [
  {
    id: '8264c717-587gpoifdshdsv-8e5f298024da-0',
    type: 'committee',
    title: 'ریسک',
    subtitle: 'رایمون',
    organizationId: '8564c717-587d-472a-929a-8e5f298024da-0',
    address: 'خیابان مطهری، کوه نور، بن بست هشتم پلاک 8',
    phone: '021- 777 14 751',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
  },
  {
    id: '8164c717-587gpoifd748744-8e5f298024da-0',
    type: 'committee',
    title: 'انتصاب',
    organizationId: '8564c717-587d-472a-929a-8e5f298024da-0',
    subtitle: 'رایمون',
    address: 'خیابان مطهری، کوه نور، بن بست هشتم پلاک 8',
    phone: '021- 735 14 751',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-3.webp`,
  },
];

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'امیر شکوهی نیا',
    first_name: 'امیر',
    last_name: 'شکوهی نیا',
    email: 'shokouhinia@pish.run',
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    country: _mock.countryNames(1),
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
    organizations: [
      {
        id: '8564c717-587d-472a-929a-8e5f298024da-0',
        type: 'organization',
        title: 'رایمون',
        organizationId: null,
        subtitle: 'مشاوره مدیریتی مهندسی',
        address: 'خیابان مطهری، کوه نور، بن بست هشتم پلاک 8',
        phone: '021- 888 14 751',
        logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
        committees: mockedCommittees,
      },
    ],
  };

  return { user };
}
