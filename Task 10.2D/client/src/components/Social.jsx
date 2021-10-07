import React from 'react'
import { Header, Icon } from 'semantic-ui-react'

//Social links compoment
function Social() {
    return <div className='social'>
        <Header as='h2'>FOLLOW US</Header>
        <Icon name='facebook' size='big'/>
        <Icon name='twitter' size='big'/>
        <Icon name='instagram' size='big'/>
    </div>
}

export default Social