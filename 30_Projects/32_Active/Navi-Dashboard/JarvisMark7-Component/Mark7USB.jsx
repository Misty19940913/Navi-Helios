import React from 'react';
import './Mark7USB.css';

/**
 * Mark7USB - USB and Disk Information
 * Displays storage metrics in their orbital positions.
 */
const Mark7USB = ({ id = 1, x = 300, y = 300, angle = 0, size = "0.0 B", percent = 100 }) => {
  return (
    <div className="mark7-usb-wrapper" style={{ left: x, top: y, transform: `rotate(${angle}deg)` }}>
      <img src="assets/USB_Disk/diskbg.png" className="usb-bg" alt="Disk Background" />
      
      <div className="usb-info">
        <div className="usb-id">DISK_0{id}</div>
        <div className="usb-size">{size}</div>
        
        <div className="usb-bar-container">
           <div className="usb-bar-fill" style={{ width: `${percent}%` }} />
           <img src="assets/USB_Disk/diskbar.png" className="usb-bar-asset" />
        </div>
        
        <div className="usb-percent">{percent}%</div>
        <div className="usb-status">MOUNTED</div>
      </div>
      
      <img src="assets/USB_Disk/usbbg.png" className="usb-decoration" />
    </div>
  );
};

export default Mark7USB;
