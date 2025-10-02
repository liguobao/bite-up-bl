import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockContent } from '../data/mockData';
import { formatDate, formatFollowers, formatStat } from '../utils/formatters';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const content = useMemo(() => mockContent.find((item) => item.id === id), [id]);

  if (!content) {
    return (
      <div className="detail-page">
        <header className="detail-header">
          <Link to="/" className="back-button">
            ← 返回
          </Link>
        </header>
        <div className="detail-empty">
          <p>抱歉，未找到对应内容。</p>
          <Link to="/" className="action-button primary">
            回到首页
          </Link>
        </div>
      </div>
    );
  }

  const { videoInfo, uploader, specialtyProduct, externalLinks, recommender, metadata } = content;
  const purchaseLinks = externalLinks.filter((link) => link.type === 'purchase');
  const otherLinks = externalLinks.filter((link) => link.type !== 'purchase');

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link to="/" className="back-button" aria-label="返回首页">
          <span aria-hidden="true">←</span>
          <span className="label">返回</span>
        </Link>
        <div className="detail-brand" aria-label="biteup 标识">
          <span className="brand-tag">biteup</span>
          <span className="brand-name">寻味阿婆</span>
        </div>
      </header>

      <main className="detail-body">
        <section className="detail-visual">
          <div className="detail-media">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              referrerPolicy="no-referrer"
            />
            <div className="detail-media-overlay">
              <span className="duration">{videoInfo.duration}</span>
              {metadata.featured && <span className="badge">精选</span>}
            </div>
          </div>
          <div className="detail-actions">
            <a
              className="action-button primary"
              href={videoInfo.videoUrl}
              target="_blank"
              rel="noreferrer"
            >
              观看视频
            </a>
            {purchaseLinks.map((link, index) => (
              <a
                key={link.url}
                className="action-button"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {index === 0 ? '立即购买' : link.title}
              </a>
            ))}
          </div>
        </section>

        <section className="detail-info">
          <div className="detail-title">
            <h1>{videoInfo.title}</h1>
            <div className="detail-tags">
              <span className="chip">#{metadata.region}</span>
              <span className="chip">#{metadata.category}</span>
              {specialtyProduct.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="chip">#{tag}</span>
              ))}
            </div>
          </div>

          <p className="detail-description">{videoInfo.description}</p>

          <div className="detail-stats" aria-label="内容统计">
            <div className="stat">
              <span className="label">播放量</span>
              <span className="value">{formatStat(videoInfo.viewCount)}</span>
            </div>
            <div className="stat">
              <span className="label">点赞</span>
              <span className="value">{formatStat(videoInfo.likeCount)}</span>
            </div>
            <div className="stat">
              <span className="label">发布</span>
              <span className="value">{formatDate(videoInfo.publishDate)}</span>
            </div>
            <div className="stat">
              <span className="label">推荐</span>
              <span className="value">{formatDate(recommender.recommendDate)}</span>
            </div>
          </div>

          <div className="detail-uploader">
            <img
              src={uploader.avatar}
              alt={uploader.name}
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="name">{uploader.name}</span>
              <div className="sub">
                <span>{formatFollowers(uploader.followerCount)} 关注</span>
                {uploader.verified && <span className="verified">官方认证</span>}
              </div>
              <p className="bio">{uploader.bio}</p>
            </div>
          </div>

          <div className="detail-product">
            <span className="section-label">推荐好物</span>
            <h2>{specialtyProduct.title}</h2>
            <p>{specialtyProduct.description}</p>
            <div className="detail-tags" aria-label="产品标签">
              {specialtyProduct.tags.map((tag) => (
                <span key={tag} className="chip">#{tag}</span>
              ))}
            </div>
          </div>

          <div className="detail-recommend">
            <div className="recommender">
              <img
                src={recommender.avatar}
                alt={recommender.name}
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="name">{recommender.name}</span>
                <span className="role">{recommender.role}</span>
                <span className="reason">“{recommender.recommendReason}”</span>
              </div>
            </div>
            <span className="credibility">可信度 {recommender.credibility.toFixed(1)}</span>
          </div>

          {otherLinks.length > 0 && (
            <div className="detail-links">
              <span className="section-label">延伸阅读 / 外链</span>
              <ul>
                {otherLinks.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      <span className="link-title">{link.title}</span>
                      <span className="link-meta">{link.platform}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DetailPage;
