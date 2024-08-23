import React from 'react';
import './heading.css'
const Heading = ({ text,
    fontSize = '2rem',
    color = '#000',
    textAlign = 'center',
    fontWeight = 'normal',
    letterSpacing = 'normal',
    textTransform = 'none',
    lineHeight = '1.5',
    margin = '0',  }) => {
  return (
    <div className='head-cont'>
      <h1 style={{ fontFamily: 'Kaushan Script, cursive',fontSize,
          color,
          textAlign,
          fontWeight,
          letterSpacing,
          textTransform,
          lineHeight,
          margin, }}>{text}</h1>
    </div>
  );
}

export default Heading;
