import React from 'react';

function InfoItem({ icon, label, color, value }) {
  return (
    <article className='item'>
      <span className={color}>{icon}</span>
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </article>
  );
}

export default InfoItem;
