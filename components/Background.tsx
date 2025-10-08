import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-bg-primary bg-[linear-gradient(to_right,rgba(100,116,139,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_800px_at_50%_200px,#1e293b,transparent)]" />
    </div>
  );
};

export default Background;