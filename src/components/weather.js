import React, { useEffect, useState } from 'react';

const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherSummary, setWeatherSummary] = useState(null);
  
  const [temperatureThreshold, setTemperatureThreshold] = useState(297); // Example threshold
const [alertTriggered, setAlertTriggered] = useState(false);



  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let response='';
        if(city=='delhi')
        {
           response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=485bc00cbf8fd5eb3dc717143b834c52');
        }
        else if(city=='mumbai')
        {

            response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=485bc00cbf8fd5eb3dc717143b834c52');
        }
        else if(city=='kolkata')
            {
    
                response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=485bc00cbf8fd5eb3dc717143b834c52');
            }
            else if(city=='chennai')
                {
        
                    response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=485bc00cbf8fd5eb3dc717143b834c52');
                }
                else if(city=='hyderabad')
                    {
            
                        response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=hyderabad&appid=485bc00cbf8fd5eb3dc717143b834c52');
                    }

                    else if(city=='bangalore')
                        {
                
                            response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=bangalore&appid=485bc00cbf8fd5eb3dc717143b834c52');
                        }     
        const data = await response.json();
        setWeatherData(data);
        
        const dailySummary = calculateDailySummary(data);
        setWeatherSummary(dailySummary);
        
        // Log after setting state
        console.log(dailySummary); // This will show the correct summary
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }

    

    };

    fetchWeatherData();
  }, []);




  const calculateDailySummary = (data) => {
    if (!data || !data.main) return null;

    // Example calculations, adjust as needed
    const averageTemp = data.main.temp; // Current temperature from the response
    const maxTemp = data.main.temp_max;
    const minTemp = data.main.temp_min;
    const humidity = data.main.humidity;
    
    return {
      averageTemp,
      maxTemp,
      minTemp,
      humidity,
      weatherDescription: data.weather[0]?.description || 'No description',
    };
  };

  useEffect(() => {
    if (weatherData && weatherData.main) {
      if (weatherData.main.temp > temperatureThreshold) {
        setAlertTriggered(true);
        console.log(`Alert! Temperature exceeded ${temperatureThreshold}°C.`);
      }
    } else {
      console.log('Weather data is not available or does not contain main.');
    }
  }, [weatherData, temperatureThreshold]);

  return (
    <div>
      <h1>Weather in {city}</h1>

      {alertTriggered && <p>Alert! Temperature exceeded threshold.</p>}
      {weatherSummary ? (
        <div>
          <p>Average Temperature: {weatherSummary.averageTemp}°K</p>
          <p>Max Temperature: {weatherSummary.maxTemp}°K</p>
          <p>Min Temperature: {weatherSummary.minTemp}°K</p>
          <p>Humidity: {weatherSummary.humidity}%</p>
          <p>Condition: {weatherSummary.weatherDescription}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Weather;
