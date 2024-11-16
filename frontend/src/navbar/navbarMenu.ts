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
        title: 'Massage',
        pathname: '/massage',
        icon: 'material-symbols:dashboard-outline',
      },
      {
        title: 'Pilates',
        pathname: '/pilates',
        icon: 'material-symbols:dashboard-outline',
      },
    {
      secondaryTitle: 'Management',
      title: 'Customers',
      pathname: '/home/customers',
      icon: 'material-symbols:person-outline',
    },
    // ...
  ];
