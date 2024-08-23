import './alerts.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios at the top
const apiKey = process.env.REACT_APP_API_KEY;

const Alerts = () => {
    const [alertMsg, setAlertMsg] = useState([]);
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlert = async (latitude, longitude) => {
            const options = {
                method: 'GET',
                url: 'https://ai-weather-by-meteosource.p.rapidapi.com/alerts',
                params: {
                    lat: latitude,
                    lon: longitude,
                    timezone: 'auto',
                    language: 'en'
                },
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                // Assuming response.data contains the alerts array
                setAlertMsg(response.data.data || []); // Ensure alertMsg is an array
                setLoading(false);
                console.log(response.data);
                fetchLocation(latitude, longitude);
            } catch (error) {
                console.error('Failed to fetch weather alerts:', error);
                setError('Failed to fetch weather alerts');
                setLoading(false);
            }
        };

        const fetchLocation = async (latitude, longitude) => {
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                    params: {
                        lat: latitude,
                        lon: longitude,
                        format: 'json',
                    },
                });
                setLocation(response.data.address.city || response.data.address.region || 'Unknown location');
            } catch (error) {
                console.error('Failed to fetch location name:', error);
                setError('Failed to fetch location name');
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchAlert(latitude, longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('Failed to get your location');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
        }
    }, []);

    return (
        <div className="alerts-container">
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {location && !error && (
                <div className="location-info">
                    <h2>Weather Alerts for {location}</h2>
                </div>
            )}
            {alertMsg.length > 0 && !error && (
                <div className="alert-msg">
                    {alertMsg.map((alert, index) => (
                        <div key={index} className="alert-item">
                            <h3>{alert.event}</h3>
                            <p><strong>Onset:</strong> {new Date(alert.onset).toLocaleString()}</p>
                            <p><strong>Expires:</strong> {new Date(alert.expires).toLocaleString()}</p>
                            <p><strong>Sender:</strong> {alert.sender}</p>
                            <p><strong>Certainty:</strong> {alert.certainty}</p>
                            <p><strong>Severity:</strong> {alert.severity}</p>
                            <p><strong>Headline:</strong> {alert.headline}</p>
                            <p>{alert.description}</p>
                        </div>
                    ))}
                </div>
            )}
            {alertMsg.length === 0 && !loading && !error && (
                <p>No weather alerts for this location.</p>
            )}
        </div>
    );
}

export default Alerts;
