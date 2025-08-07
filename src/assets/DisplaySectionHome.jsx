import React from 'react';
import './DisplaySectionHome.css';

const DisplaySectionHome = () => {
  return (
    <>
      <div className="mediahero-section">
        {/* Static Background Image */}
        <div className="custom-slider-background">
          <img
            src="/homes-dark.jpg"
            alt="Background"
            className="slider-image active"
          />
        </div>

        {/* Overlay Content */}
        <div className="overlay-content">
          <h1 className="main-heading">InterAd Media</h1>
        </div>
      </div>
    </>
  )
}

export default DisplaySectionHome;