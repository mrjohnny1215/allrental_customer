import React from 'react'

export default function AllRentalLogo({ className = '', alt = 'AllRental' }) {
  return (
    <div className={`allRentalBrand ${className}`.trim()} aria-label="AllRental">
      <img className="allRentalMark" src="/images/allrental-logo-transparent.gif" alt={alt} draggable={false} />
    </div>
  )
}
