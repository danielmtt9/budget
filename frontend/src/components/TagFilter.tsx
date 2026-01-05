import React, { useState, useEffect, useRef } from 'react';
import { type Tag, getTags } from '../services/api';

interface TagFilterProps {
  selectedTagIds: number[];
  onFilterChange: (tagIds: number[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTagIds, onFilterChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTags().then(setTags).catch(console.error);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onFilterChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onFilterChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[44px] h-11 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
        id="dropdown-tag-filter"
      >
        <span className="material-symbols-outlined text-base">sell</span>
        <p className="text-sm font-medium leading-normal">
          Tags {selectedTagIds.length > 0 && `(${selectedTagIds.length})`}
        </p>
        <span className="material-symbols-outlined text-base">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50 dark:bg-slate-800 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-[300px] overflow-y-auto p-2">
            {tags.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No tags available</div>
            ) : (
              tags.map(tag => (
                <label
                  key={tag.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 transition-colors"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleToggle(tag.id)}
                    id={`tag-check-${tag.id}`}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{tag.name}</span>
                  {tag.color && (
                    <span className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
