import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Banner from './components/Banner'
import { Header as Title } from 'semantic-ui-react'
import ExpertList from './components/ExpertList';
import './App.css'
import Task from './pages/Task'
import { Modal } from 'semantic-ui-react'


//iService App compoment
function App() {
  const [activeItem, setActiveItem] = useState('')

  return (
    <div className="App">
      <Header activeItem={setActiveItem}/>
      <Banner src='img/banner.png'/>
      <div className='container'>
          <Title as="h1" textAlign='center'>Featured Experts</Title>
          <ExpertList />
      </div>
      <Footer />
      <Modal
        open={activeItem === 'postATask'}
        closeIcon
        content={<Task />}
        onClose={() => {setActiveItem('')}}
      />
    </div>
  );
}

export default App;
