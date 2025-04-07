import React from 'react';

function PackageButtons({ packageChoice, setPackageChoice }) {
  return (
    <div>
      <button onClick={() => setPackageChoice('hot')} style={{ backgroundColor: packageChoice === 'hot' ? 'orange' : 'white' }}>
        Hot
      </button>
      <button onClick={() => setPackageChoice('cold')} style={{ backgroundColor: packageChoice === 'cold' ? 'blue' : 'white' }}>
        Cold
      </button>
    </div>
  );
}

export default PackageButtons;