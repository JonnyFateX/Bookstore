import { faker } from '@faker-js/faker';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Dropdown from 'react-dropdown';
import {Slider} from 'primereact/slider';
import { useState, useEffect, useMemo } from 'react';
import { FaShuffle } from "react-icons/fa6";
import 'react-dropdown/style.css';
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function App() {
  const [sliderValue, setSliderValue] = useState(0)
  const [formData, setFormData] = useState({
    seed: "6543224123",
    reviews: "5.0"
  })
  const options = [
    'English', 'Spanish', 'Russian'
  ]
  const defaultOption = options[0]

  const [data, setData] = useState([
    {
      id: 1,
      isbn: "978-1-145-32423-8",
      title: "Life's Method",
      authors: ["Jay Clark", "George Morrison"].join(", "),
      publisher: "JGroup, 2022"
    },
    {
      id: 2,
      isbn: "978-2-765-69223-2",
      title: "Hunting",
      authors: ["Darla Gray"].join(", "),
      publisher: "Universal, 2016"
    }
])

  const columns = useMemo(
    () => [
      {
        header: '#',
        accessorFn: (dataRow, index) => index + 1,
        maxSize: 15
      },
      {
        header: 'ISBN',
        accessorKey: 'isbn',
      },
      {
        header: 'Title',
        accessorKey: 'title',
      },
      {
        header: 'Author',
        accessorKey: 'authors',
      },
      {
        header: 'Publisher',
        accessorKey: 'publisher',
      },
    ],
    [],
  )
  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: false, 
    enableTopToolbar: false,
    enableSorting: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enablePagination: false,
    enableExpandAll: false,
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) =>
      row.original.title ? (
        <h1>GGs</h1>
      ) : null,
  })

  useEffect(() =>{
    faker.seed(6543224123)
  }, [])

  function handleChange(event) {
    if(event.target.name === "seed"){
      const seed = parseInt(event.target.value)
      if(seed >= 100000000 && seed <= 999999999){
        faker.seed(seed)
      }
    }
    setFormData(prevData => {
        return {
            ...prevData,
            [event.target.name]: event.target.value
        }
    })
  }

  function onShuffle(e){
    e.preventDefault()
    setFormData(prevData => {
      const newValue = faker.number.int({min: 100000000, max: 999999999})
      document.getElementById("seed").value = newValue.toString()
      return {
        ...prevData,
        seed: newValue.toString()
      }
    })
  }

  return (
    <>
      <header>
        <form
          onChange={handleChange}
        >
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
              <input 
                className='input-button' 
                type="number" 
                id="seed" 
                name="seed" 
                placeholder='6543224123' 
                defaultValue='6543224123'
              />
              <button className='inp-btn' onClick={(e) => onShuffle(e)}><FaShuffle/></button>
            </div>
          </div>
          <div className='input-container slider-container'>
            <span className='dropdown-label'>Likes</span>
            <Slider value={sliderValue} onChange={(e) => {
              setSliderValue(e.value)
            }} />
          </div>
          <div className='input-container'>
            <span className='dropdown-label'>Reviews</span>
            <input 
              type="number" 
              id="reviews" 
              name="reviews"
              defaultValue="5.0"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </form>
      </header>
      <MaterialReactTable table={table} />
    </>
  )
}
