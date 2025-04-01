import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { faker } from '@faker-js/faker';
import Dropdown from 'react-dropdown';
import {Slider} from 'primereact/slider';
import { useState, useEffect, useMemo, useRef } from 'react';
import { FaShuffle } from "react-icons/fa6";
import { AiOutlineLike } from "react-icons/ai";
import 'react-dropdown/style.css';
import './App.css'
import './book.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function App() {
  const [amount, setAmount] = useState(20)
  const [fetching, setFetching] = useState(false)
  const tableContainerRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(5)
  const [formData, setFormData] = useState({
    language: "English",
    seed: "6543224123",
    reviews: "5.0"
  })
  const options = [
    'English', 'German', 'Dutch'
  ]
  const defaultOption = options[0]

  const [data, setData] = useState([
    {
      id: 1,
      isbn: "978-1-145-32423-8",
      title: "Life's Method",
      authors: ["Jay Clark", "George Morrison"].join(", "),
      publisher: "JGroup, 2022",
      likes: 5,
      reviews: [
        {
          comment: "Amazing book.",
          author: "Jonathan Martinez"
        },
        {
          comment: "A great approach to life.",
          author: "Mark Stark"
        },
      ],
      img: "https://picsum.photos/seed/dpwpR2Mi/130/220?grayscale"
    },
    {
      id: 2,
      isbn: "978-2-765-69223-2",
      title: "Hunting",
      authors: ["Darla Gray"].join(", "),
      publisher: "Universal, 2016",
      likes: 8,
      img: "https://picsum.photos/seed/7zFCS6/130/220",
    },
])

  useEffect(() => {
    setFetching(true)
    fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        seed: formData.seed,
        language: formData.language,
        likes: sliderValue,
        reviews: formData.reviews
      })
    })
      .then(res => res.json())
      .then(data => {
        setData(prevData => {
          setFetching(false)
          return data["books"]
        })
      })
  }, [formData["language"], formData["seed"], formData["reviews"], sliderValue, amount])

  const columns = useMemo(
    () => [
      {
        header: '#',
        accessorKey: "id",
        maxSize: 15,
        Cell: ({ renderedCellValue, row }) =>
          row.original?.required ? (
            <span className='strong'>
              {renderedCellValue}
            </span>
          ) : (
            renderedCellValue
          ),
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

  const fetchMoreOnBottomReached = (target) => {
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      
      if(!fetching){
        console.log("here")
        setFetching(true)
        setAmount(prevAmount => {
          const newAmount = prevAmount + 10
          return newAmount
        })
      }
    }
  }

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
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: { maxHeight: '75vh' },
      onScroll: (event) =>
        fetchMoreOnBottomReached(event.target),
    },
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) =>
      {
        const book = row.original
        if(book.separator){
          return
        }
        if(book.title){
          return (
            <div className='book-container'>
              <div className='image-container'>
                <div className='img'>
                  <img src={book.img}/>
                </div>
                <span className='likes'>{book.likes} <AiOutlineLike /></span>
              </div>
              <div className='info-container'>
                <h1>{book.title}</h1>
                <h2>by {book.authors}</h2>
                <h3>{book.publisher}</h3>
                {
                  book.reviews?
                  <>
                    <h2>Reviews:</h2>
                    {
                      book.reviews.map(review => {
                        return (
                          <>
                            <p>{review.comment}</p>
                            <span className='review-span'>- {review.author}</span>
                          </>
                        )
                      })
                    }
                  </>:
                  ""
                }
              </div>
            </div>
          )
        }else{
          return (
            <></>
          )
        }
      },
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
              onChange={(selection) => {
                setFormData(prevData => {
                  return {
                    ...prevData,
                    language: selection.value
                  }
                })
              }}
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
      <section>
        <MaterialReactTable table={table}/>
      </section>
    </>
  )
}
