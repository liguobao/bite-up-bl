import { Link } from 'react-router-dom';

const friendLinks = [
  {
    label: '人生删除指南',
    description: '什么都写一点，假装很厉害的样子。',
    url: 'https://zhuanlan.zhihu.com/codelover',
  },
  {
    label: '因体科技',
    description: '数据挖掘专业软件供应商，专注于数据分析与数据可视化。',
    url: 'https://iinti.cn/zh-cn',
  },
  {
    label: 'BV/AV 互转小工具',
    description: '站内一键转换，支持链接识别、复制跳转。',
    url: '/bv-to-av',
  },
];

const FriendLinksPage = () => (
  <div className="friend-links-page">
    <header className="friend-links-hero">
      <h1>友情链接</h1>
      <p>
        汇总与寻味阿婆主题相关的实用站点，帮助你更高效地整理、扩展和分享美食内容。如果你有推荐的资源，也欢迎在
        <a
          className="friend-links__cta"
          href="https://github.com/liguobao/bite-up-bl/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 仓库提交 Issue
        </a>
        。
      </p>
    </header>

    <section className="friend-links-section" aria-label="推荐链接">
      <ul className="friend-links-list">
        {friendLinks.map((link) => {
          const isExternal = link.url.startsWith('http');
          const content = (
            <>
              <span className="friend-link__title">{link.label}</span>
              <span className="friend-link__description">{link.description}</span>
              <span className="friend-link__url">{link.url}</span>
            </>
          );

          return (
            <li key={link.url} className="friend-links-item">
              {isExternal ? (
                <a
                  className="friend-link-card"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <Link className="friend-link-card" to={link.url}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  </div>
);

export default FriendLinksPage;
