import type { InfobarContent } from '@/components/ui/infobar';

export const productInfoContent: InfobarContent = {
  title: 'Product Management',
  sections: [
    {
      title: 'Overview',
      description:
        'Manage the product catalog with server-side sorting, filtering, pagination, and search. Use Add New to create products.',
      links: [],
    },
    {
      title: 'Table features',
      description:
        'Sort by column headers, filter rows, paginate results, and search the catalog from the toolbar.',
      links: [],
    },
  ],
};
