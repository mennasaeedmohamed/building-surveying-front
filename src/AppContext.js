import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [path, setPath] = useState([]);
    const [points, setPoints] = useState([]);
    const [nextPoint, setNextPoint] = useState(null);

    useEffect(() => {
        setPoints([
            { longitude: 31.2447, latitude: 30.0534 },
            { longitude: 31.25, latitude: 30.0542 },
            { longitude: 31.2444, latitude: 30.05 },
            { longitude: 31.2483, latitude: 30.0492 },
            { longitude: 31.2428, latitude: 30.0473 },
            { longitude: 31.2458, latitude: 30.0457 },
            { longitude: 31.2406, latitude: 30.06 },
            { longitude: 31.245, latitude: 30.0598 }
        ]);
    }, []);

    return (
        <AppContext.Provider value={{ selectedPoint, setSelectedPoint, path, setPath, points, setPoints, nextPoint, setNextPoint }}>
            {children}
        </AppContext.Provider>
    );
};
