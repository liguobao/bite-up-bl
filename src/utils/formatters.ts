const numberFormatter = new Intl.NumberFormat('zh-CN');

const followerFormatter = new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
  notation: 'compact',
  compactDisplay: 'short',
});

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export const formatStat = (value: number) => numberFormatter.format(value);

export const formatFollowers = (value: number) => followerFormatter.format(value);

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
