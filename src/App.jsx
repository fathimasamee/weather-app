import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, Zap, Loader2 } from 'lucide-react';

const WeatherApp = () => {
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
      return isDay ? <Sun className="w-12 h-12 text-yellow-400" /> : <Sun className="w-12 h-12 text-gray-300" />;
    } else if (conditionLower.includes('partly cloudy') || conditionLower.includes('partly')) {
      return <Cloud className="w-12 h-12 text-blue-300" />;
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return <Cloud className="w-12 h-12 text-gray-400" />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow className="w-12 h-12 text-blue-200" />;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <Zap className="w-12 h-12 text-yellow-500" />;
    }
    return <Sun className="w-12 h-12 text-yellow-400" />;
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
    e.preventDefault();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl">Loading weather data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              {weatherData?.location.name}
            </h1>
            <p className="text-blue-200 text-sm">{getCurrentDate()}</p>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search city..."
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 pr-10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {weatherData && (
          <>
            {/* Main Weather Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-6xl font-light mb-2">
                      {Math.round(weatherData.current.temp_c)}°
                    </div>
                    <div className="text-blue-200 text-lg">
                      {weatherData.current.condition.text}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-24 h-24 bg-white/10 rounded-full">
                    {getWeatherIcon(weatherData.current.condition.text, weatherData.current.is_day)}
                  </div>
                </div>

                {/* Weather Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                    <div className="text-sm text-blue-200">Humidity</div>
                    <div className="text-xl font-semibold">{weatherData.current.humidity}%</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <Wind className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                    <div className="text-sm text-blue-200">Wind Speed</div>
                    <div className="text-xl font-semibold">{weatherData.current.wind_kph} km/h</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-sm text-blue-200">UV Index</div>
                    <div className="text-xl font-semibold">{weatherData.current.uv}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                    <div className="text-sm text-blue-200">Visibility</div>
                    <div className="text-xl font-semibold">{weatherData.current.vis_km} km</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h2 className="text-xl font-semibold mb-6">5-Day Forecast</h2>
              <div className="flex justify-between space-x-4">
                {forecast.map((day, index) => (
                  <div key={index} className="flex-1 text-center bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <div className="text-blue-200 text-sm mb-3">
                      {index === 0 ? 'Tomorrow' : formatDate(day.date)}
                    </div>
                    <div className="flex justify-center mb-3">
                      {getWeatherIcon(day.day.condition.text)}
                    </div>
                    <div className="text-xs text-blue-200 mb-2">
                      {day.day.condition.text}
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold">
                        {Math.round(day.day.maxtemp_c)}°
                      </div>
                      <div className="text-sm text-blue-300">
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

export default WeatherApp;