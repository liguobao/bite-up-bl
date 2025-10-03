import type { FC } from 'react';
import type { BiteListItem } from '../data/mockData';
import { formatStat } from '../utils/formatters';

interface ContentCardProps {
  item: BiteListItem;
}

const ContentCard: FC<ContentCardProps> = ({ item }) => {
  const { videoInfo, uploader, specialtyProduct, metadata } = item;
  const topTags = [metadata.region, specialtyProduct.tags[0], specialtyProduct.tags[1]].filter(
    Boolean,
  ) as string[];

  return (
    <article className="content-card" data-featured={metadata.featured}>
      <div className="content-cover">
        <img
          src={videoInfo.thumbnail}
          alt={videoInfo.title}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="content-cover-top">
          {metadata.featured && <span className="badge">精选</span>}
          <span className="duration">{videoInfo.duration}</span>
        </div>
        <div className="content-cover-bottom">
          <h2 className="cover-title" title={videoInfo.title}>
            {videoInfo.title}
          </h2>
          <div className="cover-stats" aria-label="互动数据">
            <span>❤ {formatStat(videoInfo.likeCount)}</span>
          </div>
        </div>
      </div>
      <div className="content-info">
        <div className="creator">
          <span className="creator-avatar" aria-hidden="true">
            <img src={uploader.avatar} alt="" referrerPolicy="no-referrer" />
          </span>
          <div>
            <span className="name">{uploader.name}</span>
            <span className="meta">
              {topTags.map((tag) => `#${tag}`).join(' · ')}
            </span>
          </div>
        </div>
        <span className="follower-chip" aria-hidden="true" />
      </div>
    </article>
  );
};

export default ContentCard;
