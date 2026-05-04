import newsData from './news.json';

export const newsCategories = [
  'Publication',
  'Award',
  'Event',
  'Announcement',
  'Presentation',
  'Funding',
] as const;

export type NewsCategory = (typeof newsCategories)[number];

export type NewsItem = {
  title: string;
  date: string; // ISO date string: YYYY-MM-DD
  category: NewsCategory;
  description: string;
  link?: { label: string; href: string };
  image?: string;
};

export const news: NewsItem[] = newsData as NewsItem[];
