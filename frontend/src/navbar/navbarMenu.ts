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
      secondaryTitle: 'Management',
      title: 'Customers',
      pathname: '/customers',
      icon: 'material-symbols:person-outline',

    }
  ];
