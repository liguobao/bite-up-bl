import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GithubComments from '../components/GithubComments';
import type { BiteContentItem } from '../data/mockData';
import { getDetailByBvid } from '../data/mockData';
import { formatDate, formatStat } from '../utils/formatters';

const DetailPage = () => {
  const { bvid } = useParams<{ bvid: string }>();
  const [content, setContent] = useState<BiteContentItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadDetail = async () => {
      if (!bvid) {
        setContent(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const detail = await getDetailByBvid(bvid);
        if (!cancelled) {
          setContent(detail ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setContent(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [bvid]);

  if (loading) {
    return (
      <div className="detail-page">
        <header className="detail-header">
          <Link to="/" className="back-button">
            ← 返回
          </Link>
        </header>
        <div className="detail-empty">
          <p>内容加载中，请稍候…</p>
        </div>
      </div>
    );
  }

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

  const { videoInfo, uploader, specialtyProduct, externalLinks, metadata, bvid: contentBvid } = content;
  const purchaseLinks = externalLinks.filter((link) => link.type === 'purchase');
  const otherLinks = externalLinks.filter(
    (link) => link.type !== 'purchase' && link.type !== 'profile'
  );
  const uploaderProfileUrl =
    externalLinks.find((link) => link.type === 'profile')?.url || videoInfo.videoUrl;
  const createFilterLink = (params: Record<string, string>) => {
    const search = new URLSearchParams(params);
    const query = search.toString();
    return query ? `/?${query}` : '/';
  };
  const primaryPurchaseLink = purchaseLinks[0];

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link to="/" className="back-button" aria-label="返回首页">
          <span aria-hidden="true">←</span>
          <span className="label">返回</span>
        </Link>
      </header>

      <main className="detail-body">
        <section className="detail-visual">
          <div className="detail-media">
            <a
              className="detail-media-link"
              href={videoInfo.videoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="打开原视频"
            >
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                referrerPolicy="no-referrer"
              />
            </a>
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

          <section className="detail-product" aria-label="推荐好物">
            <span className="section-label">推荐好物</span>
            <h2>
              {primaryPurchaseLink ? (
                <a
                  className="detail-product__link"
                  href={primaryPurchaseLink.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {specialtyProduct.title}
                </a>
              ) : (
                specialtyProduct.title
              )}
            </h2>
            <p>{specialtyProduct.description}</p>
            <div className="detail-tags" aria-label="产品标签">
              {specialtyProduct.tags.map((tag) => (
                <Link key={tag} className="chip chip-link" to={createFilterLink({ q: tag })}>
                  #{tag}
                </Link>
              ))}
            </div>
          </section>
        </section>

        <section className="detail-info">
          <div className="detail-title">
            <h1>{videoInfo.title}</h1>
            <div className="detail-tags">
              <Link
                className="chip chip-link"
                to={createFilterLink({ region: metadata.region })}
              >
                #{metadata.region}
              </Link>
              <Link
                className="chip chip-link"
                to={createFilterLink({ category: metadata.category })}
              >
                #{metadata.category}
              </Link>
              {specialtyProduct.tags.slice(0, 4).map((tag) => (
                <Link key={tag} className="chip chip-link" to={createFilterLink({ q: tag })}>
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <p className="detail-description">{videoInfo.description}</p>

          <div className="detail-stats" aria-label="内容统计">
            <div className="stat">
              <span className="label">点赞</span>
              <span className="value">{formatStat(videoInfo.likeCount)}</span>
            </div>
            <div className="stat">
              <span className="label">发布</span>
              <span className="value">{formatDate(videoInfo.publishDate)}</span>
            </div>
          </div>

          <div className="detail-uploader">
            <a
              className="uploader-link"
              href={uploaderProfileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`访问 ${uploader.name} 的主页`}
            >
              <img
                src={uploader.avatar}
                alt={uploader.name}
                referrerPolicy="no-referrer"
              />
            </a>
            <div>
              <a
                className="name"
                href={uploaderProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                {uploader.name}
              </a>
              <div className="sub">
                {uploader.verified && <span className="verified">官方认证</span>}
              </div>
              <p className="bio">{uploader.bio}</p>
            </div>
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

      <section className="detail-comments" aria-label="评论互动">
        <h2>评论互动</h2>
        <GithubComments issueTerm={contentBvid || bvid || videoInfo.title} />
      </section>
    </div>
  );
};

export default DetailPage;
