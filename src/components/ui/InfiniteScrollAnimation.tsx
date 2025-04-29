import React from 'react';

const InfiniteScrollAnimation = () => {
  return (
    <div className="bg-gray-100">
      <div className="wrapper" style={{ width: '90%', maxWidth: '1536px', marginInline: 'auto', position: 'relative', height: '100px', marginTop: '5rem', overflow: 'hidden', maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))' }}>
        <div className="item item1" style={{ width: '200px', height: '100px', position: 'absolute', left: 'max(calc(200px * 8), 100%)', animation: 'scrollLeft 30s linear infinite' }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 1" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item2" style={{ animationDelay: `calc(30s / 8 * (8 - 2) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item3" style={{ animationDelay: `calc(30s / 8 * (8 - 3) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 3" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item4" style={{ animationDelay: `calc(30s / 8 * (8 - 4) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 4" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item5" style={{ animationDelay: `calc(30s / 8 * (8 - 5) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 5" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item6" style={{ animationDelay: `calc(30s / 8 * (8 - 6) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 6" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item7" style={{ animationDelay: `calc(30s / 8 * (8 - 7) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 7" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        <div className="item item8" style={{ animationDelay: `calc(30s / 8 * (8 - 8) * -1)` }}>
          <img src="https://via.placeholder.com/200x100" alt="Image 8" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollAnimation;
