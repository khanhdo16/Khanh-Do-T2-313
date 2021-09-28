import React from 'react'
import { Button, Menu } from 'semantic-ui-react'

//Header component
function Header(props) {
  const handleItemClick = (event, {name}) => {
    props.activeItem(name)
  }

  return <div>
    <Menu fluid widths={6}>
      <Menu.Item onClick={handleItemClick} header>iService</Menu.Item>
      <Menu.Item
        name='postATask'
        onClick={handleItemClick}
      />
      <Menu.Item
        name='becomeAnExpert'
        onClick={handleItemClick}
      />
      <Menu.Item
        name='findTasks'
        onClick={handleItemClick}
      />
      <Menu.Item
        name='howItWorks'
        onClick={handleItemClick}
      />

      <Menu.Item>
        <Button primary as='a' href='/custsignin.html'>Sign in</Button>
      </Menu.Item>
    </Menu>
  </div>
  
}

export default Header