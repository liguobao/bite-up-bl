import listRaw from './list.json';

export type ExternalLinkPlatform =
  | 'taobao'
  | 'jingdong'
  | 'xiaohongshu'
  | 'douyin'
  | 'weibo'
  | 'blog'
  | 'bilibili'
  | 'other';

export interface ExternalLink {
  title: string;
  url: string;
  type: 'purchase' | 'reference' | 'video' | 'profile';
  platform: ExternalLinkPlatform;
}

export interface UploaderSummary {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  verified: boolean;
}

export interface UploaderDetail extends UploaderSummary {
  followerCount: number;
}

export interface VideoInfo {
  title: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  publishDate: string;
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

export interface BiteListItem {
  bvid: string;
  uploader: UploaderSummary;
  videoInfo: VideoInfo;
  specialtyProduct: SpecialtyProduct;
  metadata: ContentMetadata;
}

export interface BiteContentItem extends BiteListItem {
  uploader: UploaderDetail;
  externalLinks: ExternalLink[];
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

const enhanceVideoInfo = (videoInfo: VideoInfo): VideoInfo => ({
  ...videoInfo,
  videoUrl: videoInfo.videoUrl?.trim() || DEFAULT_BILIBILI_URL,
  thumbnail: videoInfo.thumbnail?.trim() || createPlaceholderThumbnail(videoInfo.title),
});

const enhanceUploaderSummary = <T extends UploaderSummary>(uploader: T): T => ({
  ...uploader,
  bio: uploader.bio ?? '',
  avatar: uploader.avatar?.trim() || createAvatarPlaceholder(uploader.name),
});

const enhanceUploaderDetail = (uploader: UploaderDetail): UploaderDetail => ({
  ...enhanceUploaderSummary(uploader),
  followerCount: uploader.followerCount ?? 0,
});

const normalizeSpecialtyProduct = (product: SpecialtyProduct): SpecialtyProduct => ({
  ...product,
  tags: product.tags ?? [],
});

const enhanceListItem = (item: BiteListItem): BiteListItem => ({
  ...item,
  videoInfo: enhanceVideoInfo(item.videoInfo),
  uploader: enhanceUploaderSummary(item.uploader),
  specialtyProduct: normalizeSpecialtyProduct(item.specialtyProduct),
});

const enhanceDetailItem = (item: BiteContentItem): BiteContentItem => ({
  ...enhanceListItem(item),
  uploader: enhanceUploaderDetail(item.uploader),
  externalLinks: (item.externalLinks ?? []).map((link) => ({
    ...link,
    url: link.url.trim(),
  })),
});

const rawList = listRaw as BiteListItem[];

export const biteListItems: BiteListItem[] = rawList.map((item) => enhanceListItem(item));

const detailModules = import.meta.glob('./details/*.json', { import: 'default' }) as Record<
  string,
  () => Promise<BiteContentItem>
>;

const detailCache = new Map<string, BiteContentItem>();

export const getDetailByBvid = async (bvid: string): Promise<BiteContentItem | undefined> => {
  if (!bvid) {
    return undefined;
  }

  if (detailCache.has(bvid)) {
    return detailCache.get(bvid);
  }

  const path = `./details/${bvid}.json`;
  const loader = detailModules[path];

  if (!loader) {
    return undefined;
  }

  const rawDetail = await loader();
  const enhanced = enhanceDetailItem(rawDetail);
  detailCache.set(bvid, enhanced);
  return enhanced;
};
