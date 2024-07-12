import { useState, useEffect } from 'react'
import './App.css'
import search from './assets/icons/search.svg'
import { useStateContext } from './Context'
import { BackgroundLayout, WeatherCard, MiniCard } from './Components'
import { Line } from 'react-chartjs-2'

function App() {

  const [input, setInput] = useState('')
  const { weather, thisLocation, values, place, setPlace } = useStateContext()
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });
  const VITE_API_KEY = 'f14c8a4fb0msha98a5748b416969p16fa48jsn49970727e1f0';

  // console.log(weather)

  const submitCity = () => {
    setPlace(input)
    setInput('')
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${place}`, {
          headers: {
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
            'x-rapidapi-key': VITE_API_KEY
          }
        });
        // Example: Extracting temperature data from the API response
        const labels = response.data.forecast.forecastday.map(day => day.date);
        const temperatures = response.data.forecast.forecastday.map(day => day.day.avgtemp_c);

        // Update chart data state
        setChartData({
          ...chartData,
          labels: labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: temperatures,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Handle error state or display error message
      }
    };

    if (place) {
      fetchWeatherData();
    }
  }, [place]);

  return (
    <div className='w-full h-screen text-zinc-900 font-bold px-8'>
      <nav className='w-full p-3 flex justify-between items-center'>
        <h1 className='font-bold tracking-wide text-3xl'>Weather App</h1>
        <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>
          <img src={search} alt="search" className='w-[1.5rem] h-[1.5rem]' />
          <input onKeyUp={(e) => {
            if (e.key === 'Enter') {
              // submit the form
              submitCity()
            }
          }} type="text" placeholder='Search city' className='focus:outline-none w-full text-[#212121] text-lg' value={input} onChange={e => setInput(e.target.value)} />
        </div>
      </nav>
      <BackgroundLayout></BackgroundLayout>
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
        />

        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {
            values?.slice(1, 7).map(curr => {
              return (
                <MiniCard
                  key={curr.datetime}
                  time={curr.datetime}
                  temp={curr.temp}
                  iconString={curr.conditions}
                />
              )
            })
          }
        </div>
      </main>

       {/* Render WeatherChart only when there is data */}
       {chartData.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-2xl font-bold mb-4'>Temperature Trend for {place}</h2>
          <WeatherChart labels={chartLabels} data={chartData} />
        </div>
      )}
    </div>
    
  )
}

export default App