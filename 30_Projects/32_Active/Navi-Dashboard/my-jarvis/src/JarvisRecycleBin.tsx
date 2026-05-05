import React, { useState } from 'react';

/**
 * JarvisRecycleBin Component
 * Based on Suvi_Jarvis_Rainmeter \ RECYCLE BIN
 */

const JarvisRecycleBin: React.FC = () => {
    const [itemCount, setItemCount] = useState(12);
    const [totalSize, setTotalSize] = useState("4.2 MB");
    const [isActive, setIsActive] = useState(false);

    const isEmpty = itemCount === 0;

    const handleEmptyBin = () => {
        setItemCount(0);
        setTotalSize("0 B");
    };

    const handleReset = () => {
        setItemCount(12);
        setTotalSize("4.2 MB");
    };

    const getIcon = () => {
        if (isEmpty) {
            return isActive ? "/Skins/Suvi_Jarvis/RecycleBin/RecyclerEmptyActive.B.png" : "/Skins/Suvi_Jarvis/RecycleBin/RecyclerEmpty.B.png";
        } else {
            return isActive ? "/Skins/Suvi_Jarvis/RecycleBin/RecyclerFullActive.B.png" : "/Skins/Suvi_Jarvis/RecycleBin/RecyclerFull.B.png";
        }
    };

    return (
        <div style={{
            position: 'relative',
            width: '251px',
            height: '81px',
            color: 'white',
            fontFamily: '"Hooge 05_53", Arial, sans-serif',
            userSelect: 'none'
        }}>
            {/* Background */}
            <img src="/Skins/Suvi_Jarvis/RecycleBin/TRASH INTERFACE.png" alt="" style={{ position: 'absolute', inset: 0 }} />

            {/* Icon */}
            <img
                src={getIcon()}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onClick={isEmpty ? handleReset : handleEmptyBin}
                style={{
                    position: 'absolute',
                    left: '60px',
                    top: '25px',
                    width: '40px',
                    height: '42px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s'
                }}
                alt="Recycle Bin Icon"
            />

            {/* Labels */}
            <div style={{
                position: 'absolute', left: '142px', top: '14px',
                fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px',
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0px 0px 4px rgba(0, 148, 255, 0.8)'
            }}>
                STATUS
            </div>

            <div style={{
                position: 'absolute', left: '142px', top: '29px',
                fontSize: '11px', fontWeight: 'bold',
                color: 'white',
                textShadow: '0px 0px 4px rgba(0, 148, 255, 0.8)'
            }}>
                {itemCount} ITMS
            </div>

            <div style={{
                position: 'absolute', left: '142px', top: '43px',
                fontSize: '11px', fontWeight: 'bold',
                color: 'white',
                textShadow: '0px 0px 4px rgba(0, 148, 255, 0.8)'
            }}>
                {totalSize}
            </div>
        </div>
    );
};

export default JarvisRecycleBin;
