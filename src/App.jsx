import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, Zap, Loader2 } from 'lucide-react';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [currentCity, setCurrentCity] = useState('Colombo');
  const [error, setError] = useState('');

  // Replace with your WeatherAPI.com API key
  const API_KEY = 'YOUR_API_KEY_HERE';
  const BASE_URL = 'https://api.weatherapi.com/v1';

  const getWeatherIcon = (condition, isDay = 1) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return isDay ? <Sun className="weather-icon weather-icon-sunny" /> : <Sun className="weather-icon weather-icon-night" />;
    } else if (conditionLower.includes('partly cloudy') || conditionLower.includes('partly')) {
      return <Cloud className="weather-icon weather-icon-partly-cloudy" />;
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return <Cloud className="weather-icon weather-icon-cloudy" />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className="weather-icon weather-icon-rain" />;
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow className="weather-icon weather-icon-snow" />;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <Zap className="weather-icon weather-icon-thunder" />;
    }
    return <Sun className="weather-icon weather-icon-sunny" />;
  };

  const fetchWeather = async (city = currentCity) => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, we'll use mock data since we can't use real API keys in this environment
      // In your actual implementation, uncomment the lines below and use your API key
      
      // const currentResponse = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`);
      // const forecastResponse = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&alerts=no`);
      
      // if (!currentResponse.ok || !forecastResponse.ok) {
      //   throw new Error('Weather data not found');
      // }
      
      // const currentData = await currentResponse.json();
      // const forecastData = await forecastResponse.json();

      // Mock data for demonstration
      const mockCurrentData = {
        location: {
          name: city,
          country: city === 'Colombo' ? 'Sri Lanka' : 'Unknown',
        },
        current: {
          temp_c: city === 'Colombo' ? 28 : Math.floor(Math.random() * 20) + 15,
          condition: {
            text: city === 'Colombo' ? 'Partly cloudy' : 'Sunny',
          },
          humidity: city === 'Colombo' ? 75 : Math.floor(Math.random() * 40) + 40,
          wind_kph: city === 'Colombo' ? 12 : Math.floor(Math.random() * 20) + 5,
          uv: city === 'Colombo' ? 8 : Math.floor(Math.random() * 10) + 1,
          vis_km: city === 'Colombo' ? 10 : Math.floor(Math.random() * 15) + 5,
          is_day: 1,
        }
      };

      const mockForecastData = {
        forecast: {
          forecastday: [
            { date: '2025-06-12', day: { maxtemp_c: 30, mintemp_c: 24, condition: { text: 'Cloudy' } } },
            { date: '2025-06-13', day: { maxtemp_c: 32, mintemp_c: 26, condition: { text: 'Sunny' } } },
            { date: '2025-06-14', day: { maxtemp_c: 29, mintemp_c: 23, condition: { text: 'Rain' } } },
            { date: '2025-06-15', day: { maxtemp_c: 31, mintemp_c: 25, condition: { text: 'Partly Cloudy' } } },
            { date: '2025-06-16', day: { maxtemp_c: 28, mintemp_c: 22, condition: { text: 'Cloudy' } } },
          ]
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setWeatherData(mockCurrentData);
      setForecast(mockForecastData.forecast.forecastday);
      setCurrentCity(city);
      
    } catch (error) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="app-container loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <span className="loading-text">Loading weather data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <div className="header-info">
            <h1 className="city-name">
              <MapPin className="location-icon" />
              {weatherData?.location.name}
            </h1>
            <p className="current-date">{getCurrentDate()}</p>
          </div>
          
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search city..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              <Search className="search-icon" />
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {weatherData && (
          <>
            {/* Main Weather Card */}
            <div className="weather-card">
              <div className="weather-main">
                <div className="temperature-section">
                  <div className="temperature-display">
                    <div className="temperature">
                      {Math.round(weatherData.current.temp_c)}°
                    </div>
                    <div className="weather-condition">
                      {weatherData.current.condition.text}
                    </div>
                  </div>
                  
                  <div className="weather-icon-container">
                    {getWeatherIcon(weatherData.current.condition.text, weatherData.current.is_day)}
                  </div>
                </div>

                {/* Weather Stats */}
                <div className="weather-stats">
                  <div className="stat-card">
                    <Droplets className="stat-icon stat-icon-blue" />
                    <div className="stat-label">Humidity</div>
                    <div className="stat-value">{weatherData.current.humidity}%</div>
                  </div>
                  
                  <div className="stat-card">
                    <Wind className="stat-icon stat-icon-blue" />
                    <div className="stat-label">Wind Speed</div>
                    <div className="stat-value">{weatherData.current.wind_kph} km/h</div>
                  </div>
                  
                  <div className="stat-card">
                    <Sun className="stat-icon stat-icon-yellow" />
                    <div className="stat-label">UV Index</div>
                    <div className="stat-value">{weatherData.current.uv}</div>
                  </div>
                  
                  <div className="stat-card">
                    <Eye className="stat-icon stat-icon-blue" />
                    <div className="stat-label">Visibility</div>
                    <div className="stat-value">{weatherData.current.vis_km} km</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="forecast-card">
              <h2 className="forecast-title">5-Day Forecast</h2>
              <div className="forecast-container">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-day">
                      {index === 0 ? 'Tomorrow' : formatDate(day.date)}
                    </div>
                    <div className="forecast-icon">
                      {getWeatherIcon(day.day.condition.text)}
                    </div>
                    <div className="forecast-condition">
                      {day.day.condition.text}
                    </div>
                    <div className="forecast-temps">
                      <div className="forecast-max">
                        {Math.round(day.day.maxtemp_c)}°
                      </div>
                      <div className="forecast-min">
                        {Math.round(day.day.mintemp_c)}°
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;