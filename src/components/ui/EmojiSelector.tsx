import React, { useState } from 'react';
import { useEmojiStore } from '../../store/emojiStore';
import { EMOJI_DATA } from '../../utils/constants';

interface EmojiSelectorProps {
  selected: string;
  onSelect: (emoji: string) => void;
  isDisabled: boolean;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ 
  selected, 
  onSelect,
  isDisabled
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  return (
    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
      {EMOJI_DATA.map((emoji) => {
        const isSelected = selected === emoji.icon;
        const isHovered = hovered === emoji.icon;
        
        return (
          <button
            key={emoji.icon}
            onClick={() => !isDisabled && onSelect(emoji.icon)}
            onMouseEnter={() => setHovered(emoji.icon)}
            onMouseLeave={() => setHovered(null)}
            disabled={isDisabled}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${
              isSelected 
                ? `bg-${emoji.color} transform scale-110 shadow-lg` 
                : isHovered 
                  ? `bg-gray-100 transform scale-105` 
                  : 'bg-gray-50 hover:bg-gray-100'
            }`}
            aria-label={`Select ${emoji.name} emoji`}
          >
            {emoji.icon}
          </button>
        );
      })}
    </div>
  );
};

export default EmojiSelector;