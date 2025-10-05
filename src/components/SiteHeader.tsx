import { useState } from 'react';
import { Link } from 'react-router-dom';

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  return (
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
      <button
        type="button"
        className="site-header__menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-header-navigation"
        onClick={toggleMenu}
        aria-label={menuOpen ? '收起导航菜单' : '展开导航菜单'}
      >
        <span className="site-header__menu-icon" aria-hidden="true" />
      </button>
      <nav
        id="site-header-navigation"
        className={`site-header__nav${menuOpen ? ' site-header__nav--open' : ''}`}
        aria-label="全站导航"
      >
        <Link to="/" onClick={handleLinkClick}>
          首页
        </Link>
        <Link to="/about" onClick={handleLinkClick}>
          关于
        </Link>
        <Link to="/links" onClick={handleLinkClick}>
          友情链接
        </Link>
        <a
          href="https://github.com/liguobao/bite-up-bl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="打开 GitHub 仓库（新标签页）"
          onClick={handleLinkClick}
        >
          GitHub
        </a>
      </nav>
    </header>
  );
};

export default SiteHeader;
