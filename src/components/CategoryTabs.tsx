import type { FC } from 'react';

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

const CategoryTabs: FC<CategoryTabsProps> = ({ categories, active, onSelect }) => {
  const items = ['all', ...categories];

  return (
    <div className="category-tabs" role="tablist" aria-label="内容分类">
      {items.map((category) => {
        const isActive = category === active;
        const label = category === 'all' ? '推荐' : category;

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`tab${isActive ? ' active' : ''}`}
            onClick={() => onSelect(category)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
