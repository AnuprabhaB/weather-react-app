
import './App.css'
import {useEffect, useState} from 'react'
import PropTypes from "prop-types"


import search from './assets/search.png';
import clear from './assets/clear.png';
import cloud from './assets/cloud.png';
import drizzle from './assets/dizzle.png';
import humidityIcon from './assets/humidity.png';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import windIcon from './assets/wind.png';




const WeatherDetails=({icon,temp,city,country,lat,log,humidity,wind})=>{
  return(
      <>
      <div className="image">
          <img src={icon}/>
      </div>
      <div className="temp">{temp}&deg;C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
            <span className='lat'>Latitude</span>
            <span>{lat}</span>
        </div>
        <div>
            <span className='log'>Longitude</span>
            <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
            <img src={humidityIcon} className='icon'/>
            <div className="data">
                <div className="humidity-percentage">{humidity}%</div>
                <div className="text">Humidity</div>
            </div>
        </div>
        <div className="element">
            <img src={windIcon} className='icon'/>
            <div className="data">
                <div className="wind-percentage">{wind} km/hr</div>
                <div className="text">Wind Speed</div>
            </div>
        </div>
      </div>
      </>
  );
}


function App() {
  const[text,setText]=useState("London");
    const[icon,setIcon]=useState(clear);
    const[temp,setTemp]=useState(90);
    const[city,setCity]=useState("Lodon");
    const[country,setCountry]=useState("");
    const[lat,setLat]=useState(0);
    const[log,setLog]=useState(0);
    const[humidity,setHumidity]=useState(0);
    const[wind,setWind]=useState(0);
    const[error,setError]=useState(null);

    const[cityNotFound,setCityNotFound]=useState(false);
    const[loading,setLoading]=useState(false);

    const weatherIconMap={
        "01d":clear,
        "01n":clear,
        "02d":cloud,
        "02n":cloud,
        "03d":drizzle,
        "03n":drizzle,
        "04d":drizzle,
        "04n":drizzle,
        "09d":rain,
        "09n":rain,
        "10d":rain,
        "10n":rain,
        "13d":snow,
        "13n":snow,
    }

    const searchWeather=async ()=>{
        setLoading(true);
        let apiKey="d3b9f655a7a254124b58e9e58424f6c3";
     let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
     try{
       let res=await fetch(url);
       let data=await res.json();
       if(data.cod==="404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
       }
    //this is the place where the humidity data is in the api
       setHumidity(data.main.humidity);
       setWind(data.wind.speed);
       setTemp(Math.floor(data.main.temp));
       setCity(data.name);
       setCountry(data.sys.country);
       setLat(data.coord.lat);
       setLog(data.coord.lon);
       const weathericonCode=data.weather[0].icon;
       setIcon(weatherIconMap[weathericonCode]||clear);
       setCityNotFound(false);
     }catch(error){
        console.error("Error Occurred "+error.message)
        setError("An Error Ocuured whle fetching weather data.");
     }
     finally{
         setLoading(false);
     }
    };

    const handleCity=(e)=>{
        setText(e.target.value);
    };
    const handleKeyDown=(e)=>{
       if(e.key==="Enter"){
        searchWeather();
       }
    };

    useEffect(function (){
        searchWeather();
    },[]);

  return (
    <div className='container'>
        <div className='input-container'>
          <input type="text"className='cityInput' placeholder='Search City' onChange={handleCity} value={text}onKeyDown={handleKeyDown}/>
          <div className="search-icon">
             <img src={search} onClick={()=>searchWeather()}></img>
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}

        {loading && <div className="loading-message">
            Loading...
        </div>}
        {error && <div className="error-message">
            {error}
        </div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}
        <div className="copyright">
        <p>&copy; {new Date().getFullYear()} . Anuprabha</p>
        </div>
       
    </div>
  )
}
WeatherDetails.propTypes={
  icon:PropTypes.string.isRequired,
temp:PropTypes.number.isRequired,
city:PropTypes.string.isRequired,
country:PropTypes.string.isRequired,
humidity:PropTypes.number.isRequired,
wind:PropTypes.number.isRequired,
lat:PropTypes.number.isRequired,
log:PropTypes.number.isRequired,

}
export default App;
