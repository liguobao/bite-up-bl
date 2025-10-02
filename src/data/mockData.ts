import rawData from '../../data.json';

export type ExternalLinkPlatform = 'taobao' | 'jingdong' | 'xiaohongshu' | 'douyin' | 'weibo' | 'blog' | 'other';

export interface ExternalLink {
  title: string;
  url: string;
  type: 'purchase' | 'reference' | 'video' | 'profile';
  platform: ExternalLinkPlatform;
}

export interface Recommender {
  id: string;
  name: string;
  avatar: string;
  role: string;
  credibility: number;
  recommendReason: string;
  recommendDate: string;
}

export interface Uploader {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followerCount: number;
  verified: boolean;
}

export interface VideoInfo {
  title: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  publishDate: string;
  viewCount: number;
  likeCount: number;
  description: string;
}

export interface SpecialtyProduct {
  title: string;
  description: string;
  tags: string[];
}

export interface ContentMetadata {
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'scheduled' | 'published';
  category: string;
  region: string;
  featured: boolean;
}

export interface BiteContentItem {
  id: string;
  uploader: Uploader;
  videoInfo: VideoInfo;
  specialtyProduct: SpecialtyProduct;
  externalLinks: ExternalLink[];
  recommender: Recommender;
  metadata: ContentMetadata;
}

const DEFAULT_BILIBILI_URL =
  'https://www.bilibili.com/video/BV1Qop4zBEin/?spm_id_from=333.1007.tianma.2-2-5.click';

const createPlaceholderThumbnail = (title: string) => {
  const fallbackChar = '味';
  const char = title.trim().charAt(0) || fallbackChar;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff2e63"/><stop offset="100%" stop-color="#ff8a5c"/></linearGradient></defs><rect width="600" height="800" fill="url(#grad)"/><text x="50%" y="54%" font-family="'Noto Sans SC', 'PingFang SC', sans-serif" font-size="360" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${char}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createAvatarPlaceholder = (name: string) => {
  const char = name.trim().charAt(0) || '味';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="avatar" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3a0ca3"/><stop offset="100%" stop-color="#ff2e63"/></linearGradient></defs><rect width="160" height="160" rx="36" fill="url(#avatar)"/><text x="50%" y="53%" font-family="'Noto Sans SC', 'PingFang SC', sans-serif" font-size="86" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${char}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const typedData = rawData as BiteContentItem[];

export const mockContent: BiteContentItem[] = typedData.map((item) => ({
  ...item,
  videoInfo: {
    ...item.videoInfo,
    videoUrl: item.videoInfo.videoUrl?.trim() || DEFAULT_BILIBILI_URL,
    thumbnail:
      item.videoInfo.thumbnail?.trim() || createPlaceholderThumbnail(item.videoInfo.title),
  },
  uploader: {
    ...item.uploader,
    avatar: item.uploader.avatar?.trim() || createAvatarPlaceholder(item.uploader.name),
  },
  recommender: {
    ...item.recommender,
    avatar: item.recommender.avatar?.trim() || createAvatarPlaceholder(item.recommender.name),
  },
}));
