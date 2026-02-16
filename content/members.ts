export const membersContent = {
  title: 'Lab Members Area',
  description: 'Internal space for Maruvka Lab members',
  
  updates: [
    {
      id: 1,
      date: '2026-02-15',
      title: 'Welcome to the Members Area',
      content: 'This is your internal space for sharing lab resources, updates, and important links.',
      author: 'Lab Admin',
    },
    // Add more updates here as needed
  ],
  
  links: [
    {
      category: 'Lab Resources',
      items: [
        { name: 'Lab Protocols', url: '#', description: 'Standard operating procedures' },
        { name: 'Data Storage', url: '#', description: 'Access to shared data repositories' },
        { name: 'Equipment Calendar', url: '#', description: 'Book lab equipment' },
      ],
    },
    {
      category: 'Collaboration Tools',
      items: [
        { name: 'GitHub Organization', url: 'https://github.com/maruvka-lab', description: 'Lab code repositories' },
        { name: 'Shared Drive', url: '#', description: 'Documents and presentations' },
        { name: 'Meeting Notes', url: '#', description: 'Lab meeting archives' },
      ],
    },
    {
      category: 'Administrative',
      items: [
        { name: 'Expense Reporting', url: '#', description: 'Submit reimbursements' },
        { name: 'Time Off Requests', url: '#', description: 'Vacation and leave' },
        { name: 'Lab Manual', url: '#', description: 'Policies and guidelines' },
      ],
    },
  ],
  
  quickLinks: [
    { name: 'Slack Workspace', url: '#', icon: '💬' },
    { name: 'Calendar', url: '#', icon: '📅' },
    { name: 'Literature Library', url: '#', icon: '📚' },
    { name: 'Computing Cluster', url: '#', icon: '💻' },
  ],
} as const;
