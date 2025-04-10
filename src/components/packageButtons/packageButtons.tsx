import React from 'react';

function PackageButtons({ packageChoice, setPackageChoice }) {
  return (
    <div>
      <div className="package-buttons">
        <button className={`package-btn hot-btn ${packageChoice === 'hot' ? 'selected' : ''}`}
          onClick={() => setPackageChoice('hot')}
        >
          🔥 Varm
        </button>
        <button
          className={`package-btn cold-btn ${packageChoice === 'cold' ? 'selected' : ''}`}
          onClick={() => setPackageChoice('cold')}
        >
          ❄️ Kall
        </button>
      </div>
    </div>
  );
}

export default PackageButtons;