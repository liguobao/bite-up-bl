import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { BiteListItem } from '../data/mockData';
import ContentCard from './ContentCard';

interface CardGridProps {
  items: BiteListItem[];
}

const CardGrid: FC<CardGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>没有找到符合条件的内容，换个关键词试试吧。</p>
      </div>
    );
  }

  return (
    <section className="card-grid" aria-live="polite">
      {items.map((item) => (
        <Link key={item.bvid} to={`/content/${item.bvid}`} className="card-link">
          <ContentCard item={item} />
        </Link>
      ))}
    </section>
  );
};

export default CardGrid;
