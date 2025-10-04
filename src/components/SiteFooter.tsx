const currentYear = new Date().getFullYear();

const SiteFooter = () => (
  <footer className="site-footer">
    <p className="site-footer__text">
      CopyRight © {currentYear}{' '}
      <a href="https://github.com/liguobao/bite-up-bl" target="_blank" rel="noopener noreferrer">
        BiteUp · 寻味阿婆
      </a>{' '}
      · All rights reserved.
    </p>
  </footer>
);

export default SiteFooter;
