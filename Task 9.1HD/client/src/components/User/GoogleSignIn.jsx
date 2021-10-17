import React, { useEffect } from 'react'
import { Message, Icon } from 'semantic-ui-react'
import { useAuth } from '../../use-auth'

const GoogleSignIn = () => {
    const auth = useAuth()
    
    useEffect(() => {
      setTimeout(() => {
        auth.signin()
      }, 3000)
    })

    return <Message size='massive' compact>
      <Icon name='circle notched' loading />
      Authenticated successfully. Signing in with Google!
    </Message>
}

export default GoogleSignIn