import React from 'react';

function PackageButtons({ packageChoice, setPackageChoice }) {
  return (
    <div>
      {/* <span className='blink'>Just nu Tisdag har vi 15% rabbat boka nu!</span> */}
   
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
      <button
        className={`package-btn chill-btn ${packageChoice === 'relax' ? 'selected' : ''}`}
        onClick={() => setPackageChoice('relax')}  
      >
        Varva ner</button>
    </div>
    </div>
  );
}

export default PackageButtons;