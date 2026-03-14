import type { SVGProps } from 'react';

type IconName =
  | 'user'
  | 'news'
  | 'announce'
  | 'pharmacien'
  | 'pharmacy'
  | 'formation'
  | 'article'
  | 'law'
  | 'decision'
  | 'resources'
  | 'view'
  | 'message'
  | 'thesis'
  | 'paperclip'
  | 'calendar'
  | 'search'
  | 'refresh'
  | 'edit'
  | 'delete'
  | 'link'
  | 'save'
  | 'clock'
  | 'chart'
  | 'content'
  | 'members'
  | 'download'
  | 'mapPin'
  | 'mail'
  | 'phone'
  | 'building'
  | 'globe'
  | 'settings'
  | 'check';

interface AdminIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const paths: Record<IconName, JSX.Element> = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" /></>,
  news: <><path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" /><path d="M7 8h7M7 12h7M7 16h5" /></>,
  announce: <><path d="M3 11v2a1 1 0 0 0 1 1h2l4 3V7L6 10H4a1 1 0 0 0-1 1z" /><path d="M14 9a4 4 0 0 1 0 6" /></>,
  pharmacien: <><path d="M7 3v4M17 3v4M3 7h18" /><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M12 11v6M9 14h6" /></>,
  pharmacy: <><path d="M3 10l9-7 9 7" /><path d="M5 10h14v10H5z" /><path d="M12 13v4M10 15h4" /></>,
  formation: <><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4" /></>,
  article: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  law: <><path d="M12 3v18M5 7h14M7 7l-3 6h6l-3-6zM17 7l-3 6h6l-3-6z" /></>,
  decision: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h6M8 16h4" /></>,
  resources: <><path d="M4 5h7a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5z" /><path d="M13 8h7v11h-7" /></>,
  view: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" /><circle cx="12" cy="12" r="3" /></>,
  message: <><path d="M4 5h16v10H8l-4 4V5z" /></>,
  thesis: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  paperclip: <><path d="M8 12l5.8-5.8a3 3 0 1 1 4.2 4.2L10.6 18a5 5 0 1 1-7.1-7.1L11 3.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 9h18" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  refresh: <><path d="M20 6v5h-5" /><path d="M4 18v-5h5" /><path d="M6 11a6 6 0 0 1 10-3l4 3" /><path d="M18 13a6 6 0 0 1-10 3l-4-3" /></>,
  edit: <><path d="M4 20h4l10-10-4-4L4 16v4z" /><path d="M12 6l4 4" /></>,
  delete: <><path d="M4 7h16M9 7V4h6v3M8 10v7M12 10v7M16 10v7" /><rect x="6" y="7" width="12" height="14" rx="2" /></>,
  link: <><path d="M10 14l4-4" /><path d="M7 17a4 4 0 0 1 0-6l2-2a4 4 0 0 1 6 0" /><path d="M17 7a4 4 0 0 1 0 6l-2 2a4 4 0 0 1-6 0" /></>,
  save: <><path d="M5 4h12l2 2v14H5z" /><path d="M8 4v6h8V4M9 20v-6h6v6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chart: <><path d="M4 19h16" /><rect x="6" y="11" width="3" height="6" /><rect x="11" y="8" width="3" height="9" /><rect x="16" y="5" width="3" height="12" /></>,
  content: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
  members: <><circle cx="9" cy="10" r="3" /><circle cx="16" cy="9" r="2.5" /><path d="M3 19c0-3 2.6-5 6-5s6 2 6 5" /><path d="M14 19c.3-2 1.8-3.4 4-3.9" /></>,
  download: <><path d="M12 4v10" /><path d="M8 10l4 4 4-4" /><path d="M4 20h16" /></>
  ,
  mapPin: <><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  phone: <><path d="M6 3h4l2 5-2 2a14 14 0 0 0 4 4l2-2 5 2v4c0 1-1 2-2 2C10.3 24 0 13.7 0 5a2 2 0 0 1 2-2h4z" /></>,
  building: <><path d="M4 21V5l8-2 8 2v16" /><path d="M9 9h1M14 9h1M9 13h1M14 13h1M11 21v-4h2v4" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  settings: <><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /><path d="M3 12h2m14 0h2M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M18.4 5.6 17 7m-10 10-1.4 1.4" /></>,
  check: <><path d="M5 13l4 4L19 7" /></>
};

export default function AdminIcon({ name, className, ...props }: AdminIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
