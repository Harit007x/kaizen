import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarDays,
  Command,
  Filter,
  GalleryVerticalEnd,
  Inbox,
  Settings,
  Settings2,
} from 'lucide-react';

export const sidebarData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  workspaces: [
    {
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Inbox',
      url: '/inbox',
      icon: Inbox,
    },
    {
      name: 'Today',
      url: '#',
      icon: CalendarDays,
    },
    {
      name: 'Filters',
      url: '#',
      icon: Filter,
    },
  ],
  navSecondary: [
    // {
    //   title: 'Calendar',
    //   url: '#',
    //   icon: Calendar,
    // },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
    // {
    //   title: 'Help',
    //   url: '#',
    //   icon: Filter,
    // },
  ],
};
