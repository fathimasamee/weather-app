import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, Zap, Loader2 } from 'lucide-react';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [currentCity, setCurrentCity] = useState('Colombo');
  const [error, setError] = useState('');

  // WeatherAPI.com API key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


  const BASE_URL = 'https://api.weatherapi.com/v1';

  const getWeatherIcon = (condition, isDay = 1) => {
    const conditionLower = condition.toLowerCase();
    
    // Clear/Sunny conditions
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return isDay ? 
        <Sun size={48} style={{color: '#fbbf24'}} /> : 
        <div style={{position: 'relative'}}>
          <Sun size={48} style={{color: '#e5e7eb', opacity: 0.8}} />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: '#f3f4f6',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(243, 244, 246, 0.8)'
          }} />
        </div>;
    } 
    
    // Partly cloudy conditions
    else if (conditionLower.includes('partly cloudy') || conditionLower.includes('partly')) {
      return isDay ? 
        <div style={{position: 'relative'}}>
          <Sun size={40} style={{color: '#fbbf24', position: 'absolute', top: '-4px', left: '-4px'}} />
          <Cloud size={48} style={{color: '#93c5fd', opacity: 0.9}} />
        </div> :
        <div style={{position: 'relative'}}>
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '12px',
            height: '12px',
            backgroundColor: '#e5e7eb',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(229, 231, 235, 0.6)'
          }} />
          <Cloud size={48} style={{color: '#6b7280', opacity: 0.9}} />
        </div>;
    } 
    
    // Cloudy/Overcast conditions
    else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return isDay ? 
        <Cloud size={48} style={{color: '#9ca3af'}} /> : 
        <Cloud size={48} style={{color: '#4b5563'}} />;
    } 
    
    // Rainy conditions
    else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return isDay ? 
        <CloudRain size={48} style={{color: '#3b82f6'}} /> : 
        <CloudRain size={48} style={{color: '#1e40af'}} />;
    } 
    
    // Snow conditions
    else if (conditionLower.includes('snow')) {
      return isDay ? 
        <CloudSnow size={48} style={{color: '#bfdbfe'}} /> : 
        <CloudSnow size={48} style={{color: '#93c5fd'}} />;
    } 
    
    // Thunder/Storm conditions
    else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return isDay ? 
        <Zap size={48} style={{color: '#eab308'}} /> : 
        <Zap size={48} style={{color: '#f59e0b'}} />;
    }
    
    // Default fallback
    return isDay ? 
      <Sun size={48} style={{color: '#fbbf24'}} /> : 
      <div style={{position: 'relative'}}>
        <Sun size={48} style={{color: '#e5e7eb', opacity: 0.7}} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '8px',
          height: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(243, 244, 246, 0.8)'
        }} />
      </div>;
  };

  const fetchWeather = async (city = currentCity) => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch current weather
      const currentResponse = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`);
      const forecastResponse = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&alerts=no`);
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Weather data not found');
      }
      
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      setWeatherData(currentData);
      setForecast(forecastData.forecast.forecastday);
      setCurrentCity(city);
      
    } catch (error) {
      setError('Failed to fetch weather data. Please check the city name and try again.');
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

  // Inline styles for fallback
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #3730a3 50%, #581c87 75%, #7c2d12 100%)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '32px'
  };

  const smallCardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center'
  };

  if (loading) {
    return (
      <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Loader2 size={32} style={{animation: 'spin 1s linear infinite'}} />
          <span style={{fontSize: '20px'}}>Loading weather data...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 16px'}}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <h1 style={{fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0'}}>
              <MapPin size={24} />
              {weatherData?.location.name}, {weatherData?.location.country}
            </h1>
            <p style={{color: '#bfdbfe', fontSize: '14px', margin: '4px 0 0 0'}}>{getCurrentDate()}</p>
          </div>
          
          {/* Search Bar */}
          <div style={{position: 'relative'}}>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search city..."
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 40px 8px 16px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                width: '200px'
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#bfdbfe',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#fecaca'
          }}>
            {error}
          </div>
        )}

        {weatherData && (
          <>
            {/* Main Weather Card */}
            <div style={cardStyle}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '72px', fontWeight: '300', margin: '0 0 8px 0'}}>
                      {Math.round(weatherData.current.temp_c)}°
                    </div>
                    <div style={{color: '#bfdbfe', fontSize: '18px'}}>
                      {weatherData.current.condition.text}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '96px',
                    height: '96px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }}>
                    {getWeatherIcon(weatherData.current.condition.text, weatherData.current.is_day)}
                  </div>
                </div>

                {/* Weather Stats */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', minWidth: '300px'}}>
                  <div style={smallCardStyle}>
                    <Droplets size={24} style={{color: '#93c5fd', margin: '0 auto 8px'}} />
                    <div style={{fontSize: '14px', color: '#bfdbfe', marginBottom: '4px'}}>Humidity</div>
                    <div style={{fontSize: '20px', fontWeight: '600'}}>{weatherData.current.humidity}%</div>
                  </div>
                  
                  <div style={smallCardStyle}>
                    <Wind size={24} style={{color: '#93c5fd', margin: '0 auto 8px'}} />
                    <div style={{fontSize: '14px', color: '#bfdbfe', marginBottom: '4px'}}>Wind Speed</div>
                    <div style={{fontSize: '20px', fontWeight: '600'}}>{weatherData.current.wind_kph} km/h</div>
                  </div>
                  
                  <div style={smallCardStyle}>
                    <Sun size={24} style={{color: '#fbbf24', margin: '0 auto 8px'}} />
                    <div style={{fontSize: '14px', color: '#bfdbfe', marginBottom: '4px'}}>UV Index</div>
                    <div style={{fontSize: '20px', fontWeight: '600'}}>{weatherData.current.uv}</div>
                  </div>
                  
                  <div style={smallCardStyle}>
                    <Eye size={24} style={{color: '#93c5fd', margin: '0 auto 8px'}} />
                    <div style={{fontSize: '14px', color: '#bfdbfe', marginBottom: '4px'}}>Visibility</div>
                    <div style={{fontSize: '20px', fontWeight: '600'}}>{weatherData.current.vis_km} km</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div style={cardStyle}>
              <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '24px'}}>5-Day Forecast</h2>
              <div style={{display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'}}>
                {forecast.map((day, index) => (
                  <div key={index} style={{
                    flex: '1',
                    minWidth: '140px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '16px',
                    transition: 'background 0.3s ease'
                  }}>
                    <div style={{color: '#bfdbfe', fontSize: '14px', marginBottom: '12px'}}>
                      {index === 0 ? 'Today' : formatDate(day.date)}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '12px'}}>
                      {getWeatherIcon(day.day.condition.text)}
                    </div>
                    <div style={{fontSize: '12px', color: '#bfdbfe', marginBottom: '8px'}}>
                      {day.day.condition.text}
                    </div>
                    <div>
                      <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px'}}>
                        {Math.round(day.day.maxtemp_c)}°
                      </div>
                      <div style={{fontSize: '14px', color: '#93c5fd'}}>
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #bfdbfe;
        }
        
        button:hover {
          color: white !important;
        }
        
        @media (max-width: 768px) {
          .weather-stats {
            grid-template-columns: 1fr !important;
          }
          
          .forecast-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherApp;