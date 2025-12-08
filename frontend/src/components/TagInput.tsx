import React, { useState, useEffect, useRef } from 'react';
import { Form, Badge, ListGroup } from 'react-bootstrap';
import { Tag, getTags, createTag } from '../services/api';

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
        // Check if tag exists in suggestions (exact match)
        const existing = suggestions.find(t => t.name.toLowerCase() === inputValue.trim().toLowerCase());
        if (existing) {
          handleAddTag(existing);
        } else {
          handleCreateTag();
        }
      }
    }
  };

  return (
    <div ref={wrapperRef}>
      <div className="mb-2">
        {selectedTags.map(tag => (
          <Badge 
            key={tag.id} 
            bg="secondary" 
            className="me-1"
            style={{ backgroundColor: tag.color || '#6c757d', cursor: 'pointer' }}
            onClick={() => handleRemoveTag(tag.id)}
          >
            {tag.name} &times;
          </Badge>
        ))}
      </div>
      
      <div className="position-relative">
        <Form.Control
          type="text"
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        
        {showSuggestions && inputValue && (
          <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
            {suggestions.map(tag => (
              <ListGroup.Item 
                key={tag.id} 
                action 
                onClick={() => handleAddTag(tag)}
              >
                {tag.name}
              </ListGroup.Item>
            ))}
            {suggestions.length === 0 && (
              <ListGroup.Item action onClick={handleCreateTag}>
                Create "{inputValue}"
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default TagInput;
