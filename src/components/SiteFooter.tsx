const currentYear = new Date().getFullYear();

const SiteFooter = () => (
  <footer className="site-footer">
    <p className="site-footer__text">CopyRight © {currentYear} BiteUp · 寻味阿婆 · All rights reserved.</p>
  </footer>
);

export default SiteFooter;
