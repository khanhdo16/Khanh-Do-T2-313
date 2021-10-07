import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Banner from './components/Banner'
import { Header as Title } from 'semantic-ui-react'
import ExpertList from './components/ExpertList';
import './App.css'
import NewTask from './pages/NewTask'
import { Modal } from 'semantic-ui-react'
import { FindTask } from './pages/FindTask'


//iService App compoment
function App() {
  const [activeItem, setActiveItem] = useState(null)

  const switchMenu = () => {
    switch(activeItem) {
      case 'postATask':
        return <NewTask />
      case 'findTasks':
        return <FindTask />
      default:
        return undefined
    }
  }

  return (
    <div className="App">
      <Header activeItem={setActiveItem}/>
      <Banner src='/img/banner.png'/>
      <div className='container'>
          <Title as="h1" textAlign='center'>Featured Experts</Title>
          <ExpertList />
      </div>
      <Footer />
      <Modal
        open={activeItem !== null}
        closeIcon
        content={switchMenu}
        onClose={() => {setActiveItem(null)}}
        centered={false}
      />
    </div>
  );
}

export default App;
