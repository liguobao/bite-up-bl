import { ChangeEvent, useMemo, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import CardGrid from '../components/CardGrid';
import type { FilterState } from '../components/FilterBar';
import { mockContent } from '../data/mockData';

const baseFilters: FilterState = {
  region: 'all',
  category: 'all',
  featuredOnly: false,
  sortBy: 'newest',
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(baseFilters);

  const filterOptions = useMemo(() => {
    const regions = Array.from(new Set(mockContent.map((item) => item.metadata.region)));
    const categories = Array.from(new Set(mockContent.map((item) => item.metadata.category)));
    return { regions, categories };
  }, []);

  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    const matchesSearch = (text: string) => text.toLowerCase().includes(lowerSearch);

    const candidates = mockContent.filter((item) => {
      if (lowerSearch) {
        const haystack = [
          item.videoInfo.title,
          item.videoInfo.description,
          item.specialtyProduct.title,
          item.specialtyProduct.description,
          item.uploader.name,
          item.metadata.region,
          item.metadata.category,
          item.recommender.name,
          ...item.specialtyProduct.tags,
        ];

        const hasMatch = haystack.some((value) => matchesSearch(value));
        if (!hasMatch) {
          return false;
        }
      }

      if (filters.region !== 'all' && item.metadata.region !== filters.region) {
        return false;
      }

      if (filters.category !== 'all' && item.metadata.category !== filters.category) {
        return false;
      }

      if (filters.featuredOnly && !item.metadata.featured) {
        return false;
      }

      return true;
    });

    const sorted = candidates.slice().sort((a, b) => {
      if (filters.sortBy === 'popular') {
        return b.videoInfo.viewCount - a.videoInfo.viewCount;
      }

      return (
        new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
      );
    });

    return sorted;
  }, [filters, searchTerm]);

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleRegionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({ ...prev, region: value }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({ ...prev, sortBy: value as FilterState['sortBy'] }));
  };

  const toggleFeatured = () => {
    setFilters((prev) => ({ ...prev, featuredOnly: !prev.featuredOnly }));
  };

  return (
    <div className="feed-page">
      <div className="feed-topbar">
        <Header itemCount={filteredItems.length} />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <CategoryTabs
        categories={filterOptions.categories}
        active={filters.category}
        onSelect={handleCategorySelect}
      />

      <div className="feed-quick" aria-label="快速筛选">
        <label className="feed-select">
          <span className="visually-hidden">地区</span>
          <select value={filters.region} onChange={handleRegionChange}>
            <option value="all">全部地区</option>
            {filterOptions.regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={`chip-toggle${filters.featuredOnly ? ' active' : ''}`}
          onClick={toggleFeatured}
        >
          精选
        </button>
        <label className="feed-select">
          <span className="visually-hidden">排序</span>
          <select value={filters.sortBy} onChange={handleSortChange}>
            <option value="newest">最新发布</option>
            <option value="popular">热度优先</option>
          </select>
        </label>
      </div>

      <CardGrid items={filteredItems} />
    </div>
  );
};

export default HomePage;
