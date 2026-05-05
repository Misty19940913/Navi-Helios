import React, { useState, useEffect } from 'react';

/**
 * JarvisSuviHDD Component
 * Based on Suvi_Jarvis_Rainmeter \ HDD
 * Dual drive status monitor with activity arrows.
 */

const JarvisSuviHDD: React.FC = () => {
    const [drives, setDrives] = useState([
        { id: 1, letter: 'C:', used: 65, access: 20 },
        { id: 2, letter: 'D:', used: 42, access: 35 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDrives(prev => prev.map(d => ({
                ...d,
                access: Math.floor(Math.random() * 64)
            })));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    const ANG1 = -29.82; // -0.52057 rad to deg
    const ANG2 = 30;

    const calculateAccessPos = (baseX: number, baseY: number, val: number) => {
        const rad = (ANG2 * Math.PI) / 180;
        return {
            x: baseX + val * Math.cos(rad),
            y: baseY - val * Math.sin(rad)
        };
    };

    const access1 = calculateAccessPos(198, 81, drives[0].access);
    const access2 = calculateAccessPos(213, 103, drives[1].access);

    return (
        <div style={{
            position: 'relative',
            width: '400px',
            height: '234px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            userSelect: 'none'
        }}>
            {/* Background */}
            <img src="/Skins/Suvi_Jarvis/HDD/hddbg.png" alt="" style={{ position: 'absolute', inset: 0 }} />

            {/* Arrows (Drive Access Indicators) */}
            <img
                src="/Skins/Suvi_Jarvis/HDD/arrow1.png"
                style={{
                    position: 'absolute',
                    left: `${access1.x}px`,
                    top: `${access1.y}px`,
                    transform: `rotate(${-ANG2}deg)`,
                    transition: 'all 0.3s ease-out'
                }}
                alt=""
            />
            <img
                src="/Skins/Suvi_Jarvis/HDD/arrow2.png"
                style={{
                    position: 'absolute',
                    left: `${access2.x}px`,
                    top: `${access2.y}px`,
                    transform: `rotate(${-ANG2}deg)`,
                    transition: 'all 0.3s ease-out'
                }}
                alt=""
            />

            {/* Drive 1 */}
            <div style={{ position: 'absolute', left: '290px', top: '51px', width: '100px', height: '25px', overflow: 'hidden' }}>
                <img src="/Skins/Suvi_Jarvis/HDD/Button1.png" style={{ position: 'absolute', left: 0, top: 0 }} alt="" />
            </div>

            <div style={{
                position: 'absolute', left: '292px', top: '53px',
                width: '96px', height: '20px',
                backgroundColor: 'rgba(0,0,0,0.4)', overflow: 'hidden'
            }}>
                <img
                    src="/Skins/Suvi_Jarvis/HDD/Disk1Bar.png"
                    style={{
                        position: 'absolute', right: 0, top: 0,
                        width: `${drives[0].used}%`, height: '100%',
                        objectFit: 'cover', objectPosition: 'right'
                    }}
                    alt=""
                />
            </div>

            <div style={{
                position: 'absolute', left: '225px', top: '72px',
                color: '#020203ff', fontSize: '8px', fontWeight: 'bold',
                transform: `rotate(${ANG1}deg)`, transformOrigin: 'left bottom'
            }}>
                C:
            </div>

            <div style={{
                position: 'absolute', left: '385px', top: '51px',
                transform: 'translateX(-100%)', color: 'white',
                fontSize: '11px', fontWeight: 'bold', fontFamily: '"Arial Black"'
            }}>
                {drives[0].used}%
            </div>

            {/* Drive 2 */}
            <div style={{ position: 'absolute', left: '290px', top: '76px', width: '100px', height: '25px', overflow: 'hidden' }}>
                <img src="/Skins/Suvi_Jarvis/HDD/Button2.png" style={{ position: 'absolute', left: 0, top: 0 }} alt="" />
            </div>

            <div style={{
                position: 'absolute', left: '292px', top: '80px',
                width: '84px', height: '20px',
                backgroundColor: 'rgba(0,0,0,0.4)', overflow: 'hidden'
            }}>
                <img
                    src="/Skins/Suvi_Jarvis/HDD/Disk2Bar.png"
                    style={{
                        position: 'absolute', right: 0, top: 0,
                        width: `${drives[1].used}%`, height: '100%',
                        objectFit: 'cover', objectPosition: 'right'
                    }}
                    alt=""
                />
            </div>

            <div style={{
                position: 'absolute', left: '250px', top: '105px',
                color: '#000000ff', fontSize: '8px', fontWeight: 'bold',
                transform: `rotate(${ANG1}deg)`, transformOrigin: 'left bottom'
            }}>
                D:
            </div>

            <div style={{
                position: 'absolute', left: '371px', top: '82px',
                transform: 'translateX(-100%)', color: 'white',
                fontSize: '11px', fontWeight: 'bold', fontFamily: '"Arial Black"'
            }}>
                {drives[1].used}%
            </div>

        </div>
    );
};

export default JarvisSuviHDD;
