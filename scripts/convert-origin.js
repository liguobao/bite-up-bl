import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const ORIGIN_DIR = path.join(DATA_DIR, 'origin');
const DETAILS_DIR = path.join(DATA_DIR, 'details');
const LIST_PATH = path.join(DATA_DIR, 'list.json');

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const dryRun = args.has('--dry-run');

const pad = (value) => String(value).padStart(2, '0');

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const ensureHttps = (url) => {
  if (!url) {
    return '';
  }
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (url.startsWith('http://')) {
    return `https://${url.slice('http://'.length)}`;
  }
  return url;
};

const toIsoString = (value) => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return new Date(value * 1000).toISOString();
  }
  return new Date().toISOString();
};

const formatDuration = (seconds) => {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total <= 0) {
    return '00:00';
  }
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
};

const buildDetailItem = (origin) => {
  const data = origin?.data;
  if (!data) {
    throw new Error('Invalid origin payload: missing data field');
  }

  const owner = data.owner ?? {};
  const stat = data.stat ?? {};
  const bvid = data.bvid?.trim();

  if (!bvid) {
    throw new Error('Invalid origin payload: missing bvid');
  }

  const uploaderId = owner.mid ? `up_${owner.mid}` : 'up_unknown';
  const tags = [data.tname_v2, data.tname].filter(Boolean);
  const publishDate = toIsoString(data.pubdate ?? data.ctime);

  return {
    bvid,
    uploader: {
      id: uploaderId,
      name: owner.name?.trim() || '未知UP主',
      avatar: ensureHttps(owner.face),
      bio: '',
      followerCount: 0,
      verified: Boolean(owner.official?.type === 1 || owner.official?.certType === 1),
    },
    videoInfo: {
      title: data.title?.trim() || '未命名视频',
      videoUrl: `https://www.bilibili.com/video/${bvid}`,
      thumbnail: ensureHttps(data.pic),
      duration: formatDuration(data.duration),
      publishDate,
      likeCount: stat.like ?? 0,
      description: data.desc?.trim() || '',
    },
    specialtyProduct: {
      title: '[TODO] 关联特色产品标题',
      description: '[TODO] 关联特色产品描述',
      tags,
    },
    externalLinks: [
      {
        title: `${owner.name?.trim() || 'UP主'} · B站主页`,
        url: owner.mid ? `https://space.bilibili.com/${owner.mid}` : `https://www.bilibili.com/video/${bvid}`,
        type: 'profile',
        platform: 'bilibili',
      },
      {
        title: '特色商品链接',
        url: `https://www.bilibili.com/video/${bvid}`,
        type: 'purchase',
        platform: 'bilibili',
      },
      {
        title: '视频原链接',
        url: `https://www.bilibili.com/video/${bvid}`,
        type: 'video',
        platform: 'bilibili',
      },
    ],
    metadata: {
      createdAt: toIsoString(data.ctime),
      updatedAt: publishDate,
      status: data.state === 0 ? 'published' : 'draft',
      category: data.tname_v2 || data.tname || '未分类',
      region: '全国',
      featured: false,
    },
  };
};

const toListItem = (detail) => ({
  bvid: detail.bvid,
  uploader: {
    id: detail.uploader.id,
    name: detail.uploader.name,
    avatar: detail.uploader.avatar,
    bio: detail.uploader.bio,
    verified: detail.uploader.verified,
  },
  videoInfo: detail.videoInfo,
  specialtyProduct: detail.specialtyProduct,
  metadata: detail.metadata,
});

const writeJson = async (filePath, dataObj) => {
  const content = `${JSON.stringify(dataObj, null, 2)}\n`;
  if (dryRun) {
    return;
  }
  await fs.writeFile(filePath, content, 'utf8');
};

const main = async () => {
  const originFiles = await fs.readdir(ORIGIN_DIR);
  const listRaw = JSON.parse(await fs.readFile(LIST_PATH, 'utf8'));
  const listIndex = new Map(listRaw.map((item, idx) => [item.bvid, { idx, item }]));

  const summary = {
    processed: 0,
    skippedDetails: 0,
    skippedList: 0,
    updatedDetails: 0,
    updatedList: 0,
  };

  for (const file of originFiles) {
    if (!file.endsWith('.json')) {
      continue;
    }

    const originPath = path.join(ORIGIN_DIR, file);
    const origin = JSON.parse(await fs.readFile(originPath, 'utf8'));
    const detail = buildDetailItem(origin);
    const detailPath = path.join(DETAILS_DIR, `${detail.bvid}.json`);
    const detailExists = await fileExists(detailPath);

    if (detailExists && !force) {
      summary.skippedDetails += 1;
    } else {
      await writeJson(detailPath, detail);
      summary.updatedDetails += 1;
    }

    const listItem = toListItem(detail);
    if (listIndex.has(detail.bvid)) {
      if (force) {
        const { idx } = listIndex.get(detail.bvid);
        listRaw[idx] = listItem;
        summary.updatedList += 1;
      } else {
        summary.skippedList += 1;
      }
    } else {
      listRaw.push(listItem);
      listIndex.set(detail.bvid, { idx: listRaw.length - 1, item: listItem });
      summary.updatedList += 1;
    }

    summary.processed += 1;
  }

  await writeJson(LIST_PATH, listRaw);

  console.log('转换完成:', summary);
  if (dryRun) {
    console.log('提示：当前为 dry-run，未写入任何文件');
  }
};

main().catch((error) => {
  console.error('转换失败:', error);
  process.exit(1);
});
