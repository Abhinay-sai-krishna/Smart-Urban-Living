
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Smart Urban Living Logo"
    >
      <g>
        {/* Outer circle element, representing city/technology */}
        <path
          d="M 50,10 A 40,40 0 1 1 10,50"
          fill="none"
          stroke="currentColor"
          className="text-text-secondary"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Inner 'S' shape, representing sustainability/growth */}
        <path
          d="M 60,35 C 60,25 50,25 50,25 S 40,25 40,35 C 40,45 60,55 60,65 C 60,75 50,75 50,75 S 40,75 40,65"
          fill="none"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Logo;