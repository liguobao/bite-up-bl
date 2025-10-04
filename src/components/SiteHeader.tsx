import { Link } from 'react-router-dom';

const SiteHeader = () => (
  <header className="site-header">
    <div className="site-header__brand">
      <Link to="/" className="site-header__logo" aria-label="返回首页">
        BiteUp
      </Link>
      <div className="site-header__meta">
        <span className="site-header__title">寻味阿婆</span>
        <span className="site-header__tagline">跟着Up主吃吃喝喝~</span>
      </div>
    </div>
    <nav className="site-header__nav" aria-label="全站导航">
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Link to="/links">友情链接</Link>
      <a
        href="https://github.com/liguobao/bite-up-bl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="打开 GitHub 仓库（新标签页）"
      >
        GitHub
      </a>
    </nav>
  </header>
);

export default SiteHeader;
