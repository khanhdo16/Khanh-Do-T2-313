import React from 'react'
import { Container, Message } from 'semantic-ui-react'

function NotFound() {
    return (
        <Container textAlign='center'>
            <Message compact size='massive'>
                <Message.Content>
                <Message.Header>404</Message.Header>
                Oops. Page not found
                </Message.Content>
            </Message>
        </Container>
    )
}

export default NotFound