import { useState } from 'react'
import './App.css'

import List from './components/list/List'
import { useEffect } from 'react'
import Button from './components/button/Button'
import axios from 'axios'


function App() {

  const [url, setUrl] = useState(`https://test.uzprogers.uz/api/notes/?page=1&limit=5`)
  const [data, setData] = useState(null)
  const total = data && data.total
  const totalPage = total && Math.ceil(total / 5)

  const [newData, setNewData] = useState({
    title: '',
    content: '',
    category: ''
  })

  function handleChange(e) {
    const {name, value} = e.target

    setNewData(prev => {
      return {
        ...prev,
        [name]:value
      }
    })
  }

  function paginationBtn(totalLocation) {
    setUrl(`https://test.uzprogers.uz/api/notes/?page=${totalLocation}&limit=5`)
  }


  useEffect(()=> {
    fetch(url)
      .then(data => data.json())
      .then((result => setData(result)))
  }, [url])

  function addList(e) {
    e.preventDefault()
    axios.post('https://test.uzprogers.uz/api/notes/', newData)
    
    setNewData({
      title: '',
      content: '',
      category: ''
    })
    paginationBtn(1)
  }

  async function editList(id) {
    try {
      const editTitle = await prompt('Title-ni O\'zgartiring!')
      const editContent = await prompt('content-ni o\'zgartiring')
      const res = await axios.patch(`https://test.uzprogers.uz/api/notes/${id}`, {
        title: editTitle,
        content: editContent
      })
      console.log(res);
      }catch(err) {
        console.log(err);
      }
    paginationBtn(1)
  }

  async function deleteList(id) {
    try {
      const res = await axios.delete(`https://test.uzprogers.uz/api/notes/${id}`)
      alert('O\'chirilganligini bilish uchun sahifani yangilang :)')
      console.log(res);
    }catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="contsetDataainer">

      <form onSubmit={addList} style={{
        margin: '40px'
      }}>
        <input type="text" placeholder='Title' required onChange={handleChange} name='title' value={newData.title}/>
        <input type="text" placeholder='Content' required onChange={handleChange} name='content' value={newData.content}/>
        <input type="text" placeholder='Category' required onChange={handleChange} name='category' value={newData.category}/>
        <Button title={'Submit'} />
      </form>

      <ul>
        {
          data && data.notes.map((list) => {
            return <List key={list.id} list={list} editList={editList} deleteList={deleteList}/>
          })
        }
        </ul>

        <div className="pagination">
          {
            Array.from({length: totalPage}, (_, index) => {
              return index + 1
            }).map(index => {
              return <Button className={'pag-btn'} key={index} title={index} onClick={() => paginationBtn(index)}/>
            })
          }
        </div>

    </div>
  )
}

export default App

