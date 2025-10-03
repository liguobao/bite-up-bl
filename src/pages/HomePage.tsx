import { ChangeEvent, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import CardGrid from '../components/CardGrid';
import type { FilterState } from '../components/FilterBar';
import { biteListItems } from '../data/mockData';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') ?? '';

  const filterOptions = useMemo(() => {
    const regions = Array.from(new Set(biteListItems.map((item) => item.metadata.region)));
    const categories = Array.from(new Set(biteListItems.map((item) => item.metadata.category)));
    return { regions, categories };
  }, []);

  const regionParam = searchParams.get('region') ?? 'all';
  const categoryParam = searchParams.get('category') ?? 'all';
  const sortParam = searchParams.get('sort');
  const sortByParam: FilterState['sortBy'] = sortParam === 'popular' ? 'popular' : 'newest';
  const featuredOnly = searchParams.get('featured') === '1';

  const normalizedRegion =
    regionParam !== 'all' && !filterOptions.regions.includes(regionParam)
      ? 'all'
      : regionParam;
  const normalizedCategory =
    categoryParam !== 'all' && !filterOptions.categories.includes(categoryParam)
      ? 'all'
      : categoryParam;

  const filters = useMemo<FilterState>(
    () => ({
      region: normalizedRegion,
      category: normalizedCategory,
      featuredOnly,
      sortBy: sortByParam,
    }),
    [normalizedRegion, normalizedCategory, featuredOnly, sortByParam]
  );

  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    const matchesSearch = (text: string) => text.toLowerCase().includes(lowerSearch);

    const candidates = biteListItems.filter((item) => {
      if (lowerSearch) {
        const haystack = [
          item.videoInfo.title,
          item.videoInfo.description,
          item.specialtyProduct.title,
          item.specialtyProduct.description,
          item.uploader.name,
          item.metadata.region,
          item.metadata.category,
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
        return b.videoInfo.likeCount - a.videoInfo.likeCount;
      }

      return (
        new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
      );
    });

    return sorted;
  }, [filters, searchTerm]);

  const updateParams = (mutator: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams.toString());
    const before = searchParams.toString();
    mutator(next);
    const after = next.toString();
    if (after === before) {
      return;
    }
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    if (value === searchTerm) {
      return;
    }
    updateParams((next) => {
      if (value) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
    });
  };

  const handleCategorySelect = (category: string) => {
    if (category === filters.category) {
      return;
    }
    updateParams((next) => {
      if (category === 'all') {
        next.delete('category');
      } else {
        next.set('category', category);
      }
    });
  };

  const handleRegionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === filters.region) {
      return;
    }
    updateParams((next) => {
      if (value === 'all') {
        next.delete('region');
      } else {
        next.set('region', value);
      }
    });
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === filters.sortBy) {
      return;
    }
    updateParams((next) => {
      if (value === 'popular') {
        next.set('sort', 'popular');
      } else {
        next.delete('sort');
      }
    });
  };

  const toggleFeatured = () => {
    updateParams((next) => {
      if (filters.featuredOnly) {
        next.delete('featured');
      } else {
        next.set('featured', '1');
      }
    });
  };

  return (
    <div className="feed-page">
      <div className="feed-topbar">
        <Header itemCount={filteredItems.length} />
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
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
