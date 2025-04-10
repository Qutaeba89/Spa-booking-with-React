import React from 'react';

function PackageButtons({ packageChoice, setPackageChoice }) {
  return (
    <div>
      <span className='blink'>Just nu Tisdag har vi 15% rabbat boka nu!</span>
   
    <div className="package-buttons">
      <button className={`package-btn hot-btn ${packageChoice === 'hot' ? 'selected' : ''}`}
        onClick={() => setPackageChoice('Hot')}
      >
        🔥 Varm
      </button>
      <button
        className={`package-btn cold-btn ${packageChoice === 'cold' ? 'selected' : ''}`}
        onClick={() => setPackageChoice('Cold')}
      >
        ❄️ Kall
      </button>
    </div>
    </div>
  );
}

export default PackageButtons;