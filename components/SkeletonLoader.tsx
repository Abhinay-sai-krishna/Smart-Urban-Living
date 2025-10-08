import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className, style }) => {
  return (
    <div 
      className={`bg-slate-700/50 animate-pulse rounded-lg ${className}`} 
      style={style}
    />
  );
};

export default SkeletonLoader;
