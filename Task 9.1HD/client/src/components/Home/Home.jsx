import React from 'react'
import Banner from './Banner'
import { Header } from 'semantic-ui-react'
import ExpertList from './ExpertList';

const Home = () => {
    return (
      <div>
        <Banner src='/img/banner.png'/>
        <div className='container'>
            <Header as="h1" textAlign='center'>Featured Experts</Header>
            <ExpertList />
        </div>
      </div>
    )
}

export default Home