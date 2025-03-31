import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import Dropdown from 'react-dropdown';
import {Slider} from 'primereact/slider';
import { useState } from 'react';
import { FaShuffle } from "react-icons/fa6";
import 'react-dropdown/style.css';
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function App() {
  const [sliderValue, setSliderValue] = useState(0)
  const options = [
    'English', 'Spanish', 'Russian'
  ]
  const defaultOption = options[0];

  return (
    <header>
      <form>
        <div className='input-container'>
          <span className='dropdown-label'>Language</span>
          <Dropdown 
            controlClassName="dropdown-border"
            options={options}
            value={defaultOption}
            placeholder="Choose a language"
          />
        </div>
        <div className='input-container'>
          <span className='dropdown-label'>Seed</span>
          <div className='input-button-container'>
            <input className='input-button' type="number" id="seed" name="seed" placeholder='0123456789'/>
            <button className='inp-btn'><FaShuffle/></button>
          </div>
        </div>
        <div className='input-container slider-container'>
          <span className='dropdown-label'>Likes</span>
          <Slider value={sliderValue} onChange={(e) => {
            setSliderValue(e.value)
            console.log(e.value)
          }} />
        </div>
        <div className='input-container'>
          <span className='dropdown-label'>Reviews</span>
          <input type="number" id="reviews" name="reviews"/>
        </div>
      </form>
    </header>
  )
}
