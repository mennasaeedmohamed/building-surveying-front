// src/components/ManagerPage.js

import React, { useEffect, useState } from 'react';
import '../App.css'; 

const ManagerPage = () => {
    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = [
                { number: 1, surveyed: true },
                { number: 2, surveyed: false },
                { number: 3, surveyed: false },
                { number: 4, surveyed: false },
                { number: 5, surveyed: false },
                { number: 6, surveyed: false },
                { number: 7, surveyed: false },
                { number: 8, surveyed: false },
                { number: 9, surveyed: false },
                { number: 10, surveyed: false },
            ];
            setBuildings(data);
        };

        fetchData();
    }, []);

    return (
        <div className="manager-page">
            <h2>Buildings Information</h2>
            <ul className="building-list">
                {buildings.map((building, index) => (
                    <li key={index} className={building.surveyed ? 'surveyed' : 'not-surveyed'}>
                        Building {building.number} - {building.surveyed ? 'Surveyed' : 'Not yet surveyed'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManagerPage;
