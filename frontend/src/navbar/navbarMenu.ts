// src/data/menuItems.ts

export interface MenuItem {
    title: string;
    pathname: string;
    icon: string;
    secondaryTitle?: string;
    children?: MenuItem[];
  }
  

 export const menuItems: MenuItem[] = [
    {
      title: 'Home',
      pathname: '/home',
      icon: 'material-symbols:dashboard-outline',
    },
    {
      secondaryTitle: 'Management',
      title: 'Customers',
      pathname: '/Customer',
      icon: 'material-symbols:person-outline',
      children: [
        {
          title: 'List',
          pathname: '/users/list',
          icon: 'material-symbols:list',
        },
        {
          title: 'Create',
          pathname: '/users/create',
          icon: 'material-symbols:person-add',
        },
      ],
    },
    // ...
  ];
