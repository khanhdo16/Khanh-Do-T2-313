import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Menu, Dropdown } from 'semantic-ui-react'
import { useAuth } from '../use-auth'


//Header component
function Header() {
  const auth = useAuth()
  const history = useHistory()

  

  return <div>
    <Menu fluid size='huge'>
      <Menu.Item header href='/'>
        {auth.user && auth.user.role === 'expert' ? 'iService Expert' : 'iService'}
      </Menu.Item>
      {auth.user && auth.user.role === 'customer'
        ? <><Menu.Item content='My tasks' href='/task/user' />
            <Menu.Item content='Post a task' href='/task/create' />
          </>
         : undefined
      }
      {!auth.user || auth.user.role === 'customer'
        ?<><Menu.Item content='How it works' href='/about' />
        <Menu.Item content='Become an expert' href='/expert/signup' /></> : undefined
      }
      {auth.user && auth.user.role === 'expert'
        ?<Menu.Item content='Find tasks' href='/task' /> : undefined
      }
      <Menu.Menu position='right'>
      {!auth.user
        ? <Menu.Item fitted>
            <Button primary onClick={() => {
              history.push('/signin', {prev: history.location.pathname})
            }}>Sign in</Button>
          </Menu.Item>
        : <Dropdown item text={auth.user.fname + ' ' + auth.user.lname}>
            <Dropdown.Menu>
              <Dropdown.Item href='/profile'>Profile</Dropdown.Item>
              <Dropdown.Item href='/forgot'>Reset password</Dropdown.Item>
              {auth.user && auth.user.role === 'customer'
                ?<Dropdown.Item href='/payment'>Payment</Dropdown.Item> : undefined
              }
              <Dropdown.Item onClick={() => auth.logout()}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      }
      </Menu.Menu>
    </Menu>
  </div>
  
}

export default Header