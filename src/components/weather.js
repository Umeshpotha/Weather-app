import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faSnowflake,
  faBolt,
  faWind,
  faTemperatureLow,
  faTint,
  faEye,
  faThermometerHalf // Ensure this is included correctly
} from '@fortawesome/free-solid-svg-icons';
import './weather.css';

const getWeatherIcon = (summary) => {
  switch (summary?.toLowerCase()) {
    case 'clear':
      return <FontAwesomeIcon icon={faSun} />;
    case 'partly cloudy':
      return <FontAwesomeIcon icon={faCloudSun} />;
    case 'cloudy':
      return <FontAwesomeIcon icon={faCloud} />;
    case 'rain':
      return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
    case 'snow':
      return <FontAwesomeIcon icon={faSnowflake} />;
    case 'thunderstorm':
      return <FontAwesomeIcon icon={faBolt} />;
    default:
      return <FontAwesomeIcon icon={faTemperatureLow} />;
  }
};

const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      const options = {
        method: 'GET',
        url: 'https://ai-weather-by-meteosource.p.rapidapi.com/current',
        params: {
          lat: latitude,
          lon: longitude,
          timezone: 'auto',
          language: 'en',
          units: 'auto',
        },
        headers: {
          'x-rapidapi-key': '88bbcb303cmsh1e9085c491a5567p17a682jsn4ff8b2569e63',
          'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        setWeatherData(response.data);
        setLoading(false);
        console.log(response.data);
        fetchLocation(latitude, longitude); // Fetch city or region name based on coordinates
      } catch (error) {
        console.error(error);
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    const fetchLocation = async (latitude, longitude) => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
          },
        });
        setLocation(response.data.address.city || response.data.address.region || 'Unknown location');
      } catch (error) {
        console.error('Failed to fetch location name:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error(error);
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
    <div className='container'>
      <h1>Current Weather</h1>
      {location && <h2>{location}</h2>}
      {loading && <div className="spinner">Loading...</div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && !loading && (
        <div className="weather-info">
          <h2>{getWeatherIcon(weatherData?.current?.summary)} {weatherData?.current?.summary}</h2>
          <p>
            <FontAwesomeIcon icon={faThermometerHalf} /> Temperature: {weatherData?.current?.temperature} °C
          </p>
          <p>
            <FontAwesomeIcon icon={faTint} /> Humidity: {weatherData?.current?.humidity} %
          </p>
          <p>
            <FontAwesomeIcon icon={faWind} /> Wind Speed: {weatherData?.current?.wind?.speed} m/s
          </p>
          <p>
            <FontAwesomeIcon icon={faTemperatureLow} /> Feels Like: {weatherData?.current?.feels_like} °C 
          </p>
          <p>
            <FontAwesomeIcon icon={faEye} /> Visibility: {weatherData?.current?.visibility} meters
          </p>
          <p>
            <FontAwesomeIcon icon={faCloud} /> Pressure: {weatherData?.current?.pressure} hPa
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;
