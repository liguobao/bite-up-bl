import type { FC } from 'react';

interface HeaderProps {
  itemCount: number;
}

const Header: FC<HeaderProps> = ({ itemCount }) => (
  <header className="feed-header">
    <div className="feed-brand">
      <span className="feed-logo">BiteUp</span>
      <div>
        <h1 className="feed-title">寻味阿婆</h1>
        <p className="feed-subtitle">跟着Up主吃吃喝喝~</p>
      </div>
    </div>
    <div className="feed-counter" aria-label="精选内容数量">
      <span className="counter-value">{itemCount}</span>
      <span className="counter-label">篇精选</span>
    </div>
  </header>
);

export default Header;
