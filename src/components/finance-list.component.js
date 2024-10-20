import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {candel1} from'./candel1.js'
import { Chart, registerables } from 'chart.js';
import './desgin.css'
import Weather from './weather.js';
import { CandlestickController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
Chart.register(...registerables);
Chart.register(CandlestickController, CandlestickElement, OhlcElement);
const FinanceList = () => {
  const [chartData, setChartData] = useState(null);
  const [filter, setFilter] = useState('week');
  const [filter1, setFilter1] = useState('delhi');
  const [stockData, setStockData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      console.log(filter1);
      let response='' ;
      if(filter1=='delhi'){
       response = await fetch('http://localhost:5000/delhi/');
      }else if (filter1=='mumbai'){
       response = await fetch('http://localhost:5000/mumbai/');
      } else  if(filter1=='bangalore'){
        response = await fetch('http://localhost:5000/bangalore/');
       }else if (filter1=='chennai'){
        response = await fetch('http://localhost:5000/chennai/');
       } 
       else if(filter1=='kolkata'){
        response = await fetch('http://localhost:5000/kolkata/');
       }
       else if(filter1=='hyderabad'){
        response = await fetch('http://localhost:5000/hyderabad/');
       }
      const data = await response.json();
      setStockData(data);
      prepareChartData(data);

      const response1=await fetch('https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=485bc00cbf8fd5eb3dc717143b834c52');

    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  function formatDate(timestamp) {
    const dateObj = new Date(timestamp); // Convert timestamp to a Date object
    const year = dateObj.getFullYear(); // Get the year
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get the month (0-based, so +1), pad with '0' if necessary
    const day = String(dateObj.getDate()).padStart(2, '0'); // Get the day, pad with '0' if necessary
    
    return `${year}/${month}/${day}`; // Return the formatted date string
  }

  const prepareChartData = (stockData) => {
    
    
    let filteredData = stockData;

    if (!stockData || !Array.isArray(stockData)) {
      console.error('Invalid stock data');
      return;
    }
    if (filter == 'week') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.date);
        const today = new Date("2024-10-19");
        const lastWeek = new Date("2024-10-12");
       
        
        return date >= lastWeek && date <= today;

        
      });
    } else if (filter == 'month') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.date);
        const today = new Date("2024-10-19");
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        console.log("month");

        return date >= lastMonth && date <= today;
      });
    } 

    
    else if (filter == 'year') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.date);
        const today = new Date("2024-10-19");
        const lastYear = new Date("2024-10-19");
        console.log("year");

        return date >= lastYear && date <= today;
      });
    } else if (filter == 'custom') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.date);
        return date >= new Date(dateRange.startDate) && date <= new Date(dateRange.endDate);
      });
    }

    else if (filter == 'all') {
      filteredData = stockData.filter((row) => {
        const date = new Date(row.date);
        return date;
      });

    }


    
    
    if (!filteredData || !Array.isArray(filteredData)) {
      console.error('Invalid filtered data');
      return;
    }

    const labels = filteredData.map((row) => new Date(row.date).toLocaleDateString());
    const temp = filteredData.map((row) => row.temp);
    const pressure = filteredData.map((row) => row.pressure);
    const humidity = filteredData.map((row) => row.humidity);
    
    

  //    const labels = filteredData.map((row) => new Date(row.date).toLocaleDateString());




 



    const barData = {
      labels,
      datasets: [
        {
          label: 'Temperature',
          data: temp,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const lineData = {
      labels,
      datasets: [
        {
          label: 'Pressure',
          data: pressure,
          fill: false,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
        },
      ],
    };

    const totalVolume = humidity.reduce((acc, volume) => acc + volume, 0);
    const volumePercentages = humidity.map((volume) => (volume / totalVolume) * 100);

    const pieData = {
      labels,
      datasets: [
        {
          label: 'Humidity',
          data: volumePercentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };

    setChartData({ barData, lineData, pieData });
  };


  const handleFilterChange =  (event) => {
    setFilter(event.target.value);
    console.log(filter);
    prepareChartData(stockData);
  };


  const handleFilterChange1 =  (event) => {
    
    setFilter1(event.target.value);
    
    fetchStockData();
    prepareChartData(stockData);
  };


  const handleDateChange =  (event) => {
    setDateRange({
      ...dateRange,
      [event.target.name]: event.target.value,
    });
   
    prepareChartData(stockData);
  };

 

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Start the y-axis at zero if needed
        min: 290, // Start y-axis at 300 Kelvin
        title: {
          display: true,
          text: 'Temperature (K)',
        },
      },
    },
  };

  const options1 = {
    scales: {
      y: {
        beginAtZero: true, // Start the y-axis at zero if needed
        min: 999, // Start y-axis at 300 Kelvin
        title: {
          display: true,
          text: 'Temperature (K)',
        },
      },
    },
  };
  
  const options2 = {
    scales: {
      y: {
        beginAtZero: true, // Start the y-axis at zero if needed
        min: 999, // Start y-axis at 300 Kelvin
        title: {
          display: true,
          text: 'Temperature (K)',
        },
      },
    },
  };

  



  return (
    <div>
     
      <h4>Double click to select filter</h4>
      <div style={{ marginBottom: 20 }}>
        <button value="month" onClick={handleFilterChange}>This Month</button>
        <button value="week" onClick={handleFilterChange}>This Week</button>
        <button value="delhi" onClick={handleFilterChange1}>delhi</button>
        <button value="mumbai" onClick={handleFilterChange1}>mumbai</button>
    
        <button value="chennai" onClick={handleFilterChange1}>chennai</button>
        <button value="kolkata" onClick={handleFilterChange1}>kolkata</button>
        <button value="bangalore" onClick={handleFilterChange1}>bangalore</button>
        <button value="hyderabad" onClick={handleFilterChange1}>hyderabad</button>
      
  {filter === 'custom' && (
    <div>
      <input
        type="date"
        name="startDate"
        value={dateRange.startDate}
        onChange={handleDateChange}
        placeholder="Start Date"
      />
      <input
        type="date"
        name="endDate"
        value={dateRange.endDate}
        onChange={handleDateChange}
        placeholder="End Date"
      />
    </div>
  )}
</div>

      {chartData ? (
       
          <div className='chart-wrapper' >
            <div>
            <h2>Temperature</h2>
            <div className="chart-container">
              <Bar data={chartData.barData} options={options}/>
            </div>
            </div>
            <div>
            <h2>Pressure</h2>
            <div className="chart-container">
              <Line data={chartData.lineData} options={options1} />
            </div>
            </div><div>
            <h2>Humidity</h2>
            <div className="chart-container">
              <Pie data={chartData.pieData} />
            </div>
            </div>
            <div>

              
     <div>
       <Weather city="delhi" />
      
     </div>

      <div>
      <Weather city="mumbai" />
      </div>

      <div>
       <Weather city="bangalore" />
      
     </div>

      <div>
      <Weather city="kolkata" />
      </div>
      <div>
       <Weather city="chennai" />
      
     </div>

     <div>
       <Weather city="hyderabad" />
      
     </div>
    
      </div>












          </div>
       
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default FinanceList;