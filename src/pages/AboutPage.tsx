const AboutPage = () => (
  <div className="about-page">
    <section className="about-hero">
      <h1>关于寻味阿婆</h1>
      <p>
        寻味阿婆是一个整理 Up 主美食推荐的导航站，帮你快速定位视频里出现的特产、零食、店铺和好物链接。
      </p>
    </section>

    <section className="about-section" aria-label="我们在做什么">
      <h2>我们在做什么</h2>
      <p>
        每当 Up 主分享令人心动的美食，我们会把这些内容归档成容易检索的卡片。通过简单的筛选和搜索，你可以迅速找到视频原链接、购买渠道以及对应的推荐理由。
      </p>
    </section>

    <section className="about-section" aria-label="如何使用">
      <h2>如何使用本站</h2>
      <ul className="about-list">
        <li>浏览精选列表，快速发现最新整理的推荐。</li>
        <li>进入详情页，查看视频、购买链接和特色亮点。</li>
        <li>根据城市、品类等维度过滤，找到最适合自己的美味。</li>
      </ul>
    </section>

    <section className="about-callout" aria-label="欢迎参与">
      <h2>欢迎一起建设</h2>
      <p>
        如果你也想贡献内容或提出建议，欢迎前往我们的 GitHub 仓库提交 Issue 或 PR，一起把寻味阿婆打造成更好用的美食推荐导航。
        <a
          className="about-cta"
          href="https://github.com/liguobao/bite-up-bl/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
        >
          立即提交 Issue
        </a>
      </p>
    </section>
  </div>
);

export default AboutPage;
