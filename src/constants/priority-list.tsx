import { Icons } from '@/components/ui-extended/icons';
import { Flag } from 'lucide-react';
export const priorityList = [
  {
    id: 'p1',
    title: 'Priority 1',
    icon: <Icons.flag className="h-4 w-4 text-red fill-red" fill="#ff3838" />,
    color: 'text-red fill-red',
  },
  {
    id: 'p2',
    title: 'Priority 2',
    icon: <Icons.flag className="h-4 w-4 text-blue fill-blueBackground" fill="#3895ff" />,
    color: 'text-orange fill-orange',
  },
  {
    id: 'p3',
    title: 'Priority 3',
    icon: <Icons.flag className="h-4 w-4 text-orange fill-orangeBackground" fill="#ffaf38" />,
    color: 'text-blue fill-blue',
  },
  {
    id: 'p4',
    title: 'Priority 4',
    icon: <Icons.flag className="h-4 w-4 text-secondary" fill="#292929" />,
    color: 'text-secondary fill-secondary',
  },
];

type PriorityColorItem = {
  text: string;
  background: string;
  fill: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'blue' | 'red' | 'green' | 'purple' | 'orange'; // This can be extended if you have more variants
};

export const priorityColor: Record<'p1' | 'p2' | 'p3' | 'p4', PriorityColorItem> = {
  p1: {
    text: 'text-red',
    background: 'bg-redBackground',
    fill: '#ff3838',
    variant: 'red',
  },
  p2: {
    text: 'text-blue',
    background: 'bg-blueBackground',
    fill: '#3895ff',
    variant: 'blue',
  },
  p3: {
    text: 'text-orange',
    background: 'bg-orangeBackground',
    fill: '#ffaf38',
    variant: 'orange',
  },
  p4: {
    text: 'text-slate-400',
    background: 'bg-slate-400',
    fill: '#292929',
    variant: 'secondary',
  },
};
// export const priorityColor = {
//   p1: 'border-red-400',
//   p2: 'border-blue-400',
//   p3: 'border-orange-400',
//   p4: 'border-slate-400',
// };
