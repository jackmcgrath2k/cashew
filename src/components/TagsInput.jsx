import React, { useState } from 'react';

const tagColors = {
  food: 'bg-green-500',
  transport: 'bg-blue-500',
  utilities: 'bg-yellow-500',
  entertainment: 'bg-purple-500',
  health: 'bg-teal-500',
  travel: 'bg-pink-500',
  education: 'bg-indigo-500',
  misc: 'bg-gray-500',
};

const defaultTagColor = 'bg-gray-400 opacity-70'; // Default color for unselected tags

export default function TagsInput({ predefinedTags, setTags }) {
  const [localTags, setLocalTags] = useState([]); // State for selected tags within this component

  const toggleTag = (tag) => {
    if (localTags.includes(tag)) {
      // If the tag is already selected, remove it
      const newTags = localTags.filter(t => t !== tag);
      setLocalTags(newTags);
      setTags(newTags); // Update parent state
    } else {
      // If the tag is not selected, add it
      const newTags = [...localTags, tag];
      setLocalTags(newTags);
      setTags(newTags); // Update parent state
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center pt-5">
        {predefinedTags.map((tag, index) => (
          <button
            key={index}
            type="button" // Prevent the button from submitting the form
            className={`rounded-full px-3 py-1 mr-2 mb-2 text-white hover:bg-opacity-80 focus:outline-none ${localTags.includes(tag) ? tagColors[tag] : defaultTagColor}`}
            onClick={() => toggleTag(tag)} // Use toggleTag for both adding and removing
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
