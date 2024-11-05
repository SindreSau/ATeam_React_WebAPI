import React from 'react';
import Nokkelhull from './react-frontend/public/assets/images/nokkellhulllogo.svg'; 

type Props = {}

const KeyholeLogo: React.FC<Props> = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={Nokkelhull} alt="Nøkkelhull" style={{ width: '50px', height: 'auto' }} />
      <p style={{ color: 'green', marginLeft: '10px' }}>Nøkkelhull</p>
    </div>
  );
};

export default KeyholeLogo;