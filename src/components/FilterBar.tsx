import { ChangeEvent, FC } from 'react';

export type SortOption = 'newest' | 'popular';

export interface FilterState {
  region: string;
  category: string;
  featuredOnly: boolean;
  sortBy: SortOption;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  options: {
    regions: string[];
    categories: string[];
  };
}

const FilterBar: FC<FilterBarProps> = ({ filters, onChange, options }) => {
  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    onChange({ ...filters, [name]: checked });
  };

  return (
    <div className="filter-bar" role="region" aria-label="筛选条件">
      <div className="filter-group">
        <label>
          地区
          <select name="region" value={filters.region} onChange={handleSelect}>
            <option value="all">全部地区</option>
            {options.regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="filter-group">
        <label>
          分类
          <select name="category" value={filters.category} onChange={handleSelect}>
            <option value="all">全部分类</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="filter-group">
        <label>
          排序
          <select name="sortBy" value={filters.sortBy} onChange={handleSelect}>
            <option value="newest">最新发布</option>
            <option value="popular">热度优先</option>
          </select>
        </label>
      </div>
      <label className="toggle">
        <input
          type="checkbox"
          name="featuredOnly"
          checked={filters.featuredOnly}
          onChange={handleCheckbox}
        />
        仅看精选
      </label>
    </div>
  );
};

export default FilterBar;
