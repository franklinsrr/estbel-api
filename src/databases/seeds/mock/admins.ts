import { v4 as uuid } from 'uuid';

export const ADMINS = [
  {
    id: 'franklin-rodriguez-admin-001',
    email: 'franklinserif@gmail.com',
    password: '$2b$10$L/LFebMYfUrknCpW2RQXie0AG052lh8UwpN9MwRzt9Zq8I/Hf8/jG', // Hash of 'IwaCDZJ(XYUFaN?CQIxR123'
    member: {
      id: 'franklin-rodriguez-2024-001', // Reference to the member we created
    },
    accesses: [
      {
        id: uuid(),
        moduleName: 'users',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
      {
        id: uuid(),
        moduleName: 'admins',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
      {
        id: uuid(),
        moduleName: 'modules',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
      {
        id: uuid(),
        moduleName: 'members',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
      {
        id: uuid(),
        moduleName: 'events',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
      {
        id: uuid(),
        moduleName: 'groups',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
      {
        id: uuid(),
        moduleName: 'reports',
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPrint: true,
      },
    ],
  },
];
