import {useState, useEffect, ChangeEvent } from 'react';
import { optionType } from '../types';
import { forecastType } from '../types';

const useForecast = ( ) => {

    const [term, setTerm] = useState<string>("");
    const [city, setCity] = useState<optionType | null>(null)
    const [options, setOption] = useState<[]>([]);
    const [forecast, setForecast] = useState<forecastType | null>(null)
  
    const getSearchOptions = async (value: string) => {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=
      ${value.trim()}&limit=5&appid=${
        process.env.REACT_APP_API_KEY
      }`
      )
      .then(res => res.json())
      .then((data) => setOption(data))
      .catch(e => console.log(e))

    }
  
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim()
      /* console.log(e.target.value); */
      setTerm(value);
       /* console.log(term)  */
  
       if (value === "" ) return
  
       getSearchOptions(value)    
    }
  
    const getForecast = (city: optionType) => {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${
        process.env.REACT_APP_API_KEY
      }`)
      .then((res) => res.json())
      .then((data) => {

        const forecastData = {
           ...data.city,
           list: data.list.slice(0,16),
        }
      
      setForecast(forecastData)
    }).catch(e => console.log(e))
    ;
      
    }
  
    const onSubmit = () => {
      if(!city) return 
      getForecast(city)
    }
  
    const onOptionSelect = (option: optionType) => {
      setCity(option)
  
    }
  
    useEffect(() => {
      if(city) {
        setTerm(city.name)
        setOption([])
  
      }
    }, [city])

    return {
        forecast,
        options,
        term,
        onOptionSelect,
        onSubmit,
        onInputChange,
      }
}



export default useForecast;