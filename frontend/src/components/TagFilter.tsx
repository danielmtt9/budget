import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { Tag, getTags } from '../services/api';

interface TagFilterProps {
  selectedTagIds: number[];
  onFilterChange: (tagIds: number[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTagIds, onFilterChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags().then(setTags).catch(console.error);
  }, []);

  const handleToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onFilterChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onFilterChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-tag-filter">
        Tags {selectedTagIds.length > 0 && `(${selectedTagIds.length})`}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {tags.length === 0 ? (
            <Dropdown.Item disabled>No tags available</Dropdown.Item>
        ) : (
            tags.map(tag => (
            <div key={tag.id} className="px-3 py-1" onClick={(e) => e.stopPropagation()}>
                <Form.Check 
                type="checkbox"
                id={`tag-check-${tag.id}`}
                label={tag.name}
                checked={selectedTagIds.includes(tag.id)}
                onChange={() => handleToggle(tag.id)}
                />
            </div>
            ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TagFilter;
