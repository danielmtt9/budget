import React, { useState, useEffect, useRef } from 'react';
import { type Tag, getTags, createTag } from '../services/api';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ selectedTags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        setAllTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags', error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const filtered = allTags.filter(
      tag =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
    );
    setSuggestions(filtered);
  }, [inputValue, allTags, selectedTags]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleAddTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return;
    try {
      const newTag = await createTag({ name: inputValue.trim(), color: '#6c757d' });
      setAllTags([...allTags, newTag]);
      handleAddTag(newTag);
    } catch (error) {
      console.error('Failed to create tag', error);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        const existing = suggestions.find(t => t.name.toLowerCase() === inputValue.trim().toLowerCase());
        if (existing) {
          handleAddTag(existing);
        } else {
          handleCreateTag();
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // Remove last tag on backspace if input is empty
      handleRemoveTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 min-h-[44px]">
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              style={tag.color ? { backgroundColor: `${tag.color}20`, color: tag.color } : {}}
            >
              {tag.name}
              <button
                type="button"
                className="hover:text-red-500 focus:outline-none min-w-[22px] min-h-[22px] flex items-center justify-center -mr-1"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="flex-1 border-none bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-0 dark:text-white dark:placeholder:text-slate-400 min-w-[100px]"
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showSuggestions && inputValue && (
        <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden z-50 dark:bg-slate-800 dark:border-slate-700 max-h-48 overflow-y-auto">
          {suggestions.map(tag => (
            <button
              key={tag.id}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50 flex items-center gap-2"
              onClick={() => handleAddTag(tag)}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
              {tag.name}
            </button>
          ))}
          {suggestions.length === 0 && (
            <button
              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 font-medium"
              onClick={handleCreateTag}
            >
              Create "{inputValue}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput;
