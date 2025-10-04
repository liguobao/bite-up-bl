import { ChangeEvent, FC } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="搜索菜品、农产品、城市、标签或创作者"
        value={value}
        onChange={handleInput}
        aria-label="搜索内容"
      />
      <span className="icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <line x1="17" y1="17" x2="22" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
};

export default SearchBar;
