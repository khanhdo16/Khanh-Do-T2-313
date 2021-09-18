import Banner from './components/Banner'
import Header from './components/Header'
import { Header as Title } from 'semantic-ui-react'
import ExpertList from './components/ExpertList';
import Footer from './components/Footer'
import './App.css'

//iService App compoment
function App() {
  return (
    <div className="App">
      <Header />
      <Banner src='img/banner.png'/>
      <div className='expert-container'>
        <Title as="h1" textAlign='center'>Featured Experts</Title>
        <ExpertList />
      </div>
      <Footer />
    </div>
  );
}

export default App;
