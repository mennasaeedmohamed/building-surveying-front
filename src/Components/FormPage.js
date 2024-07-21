import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';

const FormPage = () => {
    const { selectedPoint, setPath, points, setSelectedPoint, setNextPoint, setPoints } = useContext(AppContext);
    const [formData, setFormData] = useState({
        buildingNumber: '',
        numberOfFloors: '',
        hasElectricity: false,
        hasWater: false,
        detailedLocation: '',
        xCoordinate: '',
        yCoordinate: '',
        photoDate: '',
        location: ''  // Add location field
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedPoint) {
            setFormData(prevData => ({
                ...prevData,
                xCoordinate: selectedPoint.longitude,
                yCoordinate: selectedPoint.latitude
            }));
        }
    }, [selectedPoint]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        const currentPoint = { longitude: formData.xCoordinate, latitude: formData.yCoordinate };
        setPath(prevPath => [...prevPath, currentPoint]);

        const remainingPoints = points.filter(point => !(point.longitude === currentPoint.longitude && point.latitude === currentPoint.latitude));
        setPoints(remainingPoints);

        if (remainingPoints.length > 0) {
            const closestPoint = findClosestPoint(currentPoint, remainingPoints);
            setNextPoint(closestPoint);
            setSelectedPoint(closestPoint);
        } else {
            setNextPoint(null); // All points visited
        }

        try {
            const response = await fetch('https://localhost:7212/api/Building', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error posting data');
            }

            navigate('/map');
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    const findClosestPoint = (current, points) => {
        let closestPoint = null;
        let minDistance = Infinity;

        points.forEach(point => {
            const distance = calculateDistance(current, point);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        return closestPoint;
    };

    const calculateDistance = (point1, point2) => {
        const dx = point1.longitude - point2.longitude;
        const dy = point1.latitude - point2.latitude;
        return Math.sqrt(dx * dx + dy * dy);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h1>Building Info</h1>
                <input type="text" name="buildingNumber" placeholder="Building Number" value={formData.buildingNumber} onChange={handleInputChange} />
                <input type="text" name="numberOfFloors" placeholder="Number of Floors" value={formData.numberOfFloors} onChange={handleInputChange} />
                <label>
                    Electricity:
                    <input type="checkbox" name="hasElectricity" checked={formData.hasElectricity} onChange={handleInputChange} />
                </label>
                <label>
                    Water:
                    <input type="checkbox" name="hasWater" checked={formData.hasWater} onChange={handleInputChange} />
                </label>
                <input type="text" name="xCoordinate" placeholder="X Coordinate" value={formData.xCoordinate} onChange={handleInputChange} readOnly />
                <input type="text" name="yCoordinate" placeholder="Y Coordinate" value={formData.yCoordinate} onChange={handleInputChange} readOnly />
                <input type="datetime-local" name="photoDate" value={formData.photoDate} onChange={handleInputChange} />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FormPage;
