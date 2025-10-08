

import React from 'react';
import { UserRole } from '../types';

interface AIGenerationBlockProps {
  title: string;
  content: string | React.ReactNode;
  isLoading: boolean;
  onGenerate: () => void;
  userRole: UserRole;
  citizenInfo: string;
  controls?: React.ReactNode;
}

const AIGenerationBlock: React.FC<AIGenerationBlockProps> = ({ title, content, isLoading, onGenerate, userRole, citizenInfo, controls }) => {
  
  const renderContent = () => {
    if (typeof content === 'string') {
        if (!content) return null;
        const formattedContent = content.startsWith('Error:') 
            ? `<p class="text-red-400">${content}</p>` 
            : content
                .replace(/\*/g, '')
                .replace(/^- /gm, '<li class="mb-1">')
                .replace(/(\r\n|\n|\r)/gm, '</li>') + '</li>';
        return <ul className="list-disc pl-5" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
    }
    return content;
  };

  return (
    <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-full flex flex-col border border-border-color">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-text-main">{title}</h3>
        {userRole === UserRole.Admin && (
          <div className="flex items-center space-x-2">
            {controls}
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
            >
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 text-text-secondary prose prose-p:my-1 prose-ul:pl-5">
        {userRole === UserRole.Citizen ? (
            <p>{citizenInfo}</p>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AIGenerationBlock;