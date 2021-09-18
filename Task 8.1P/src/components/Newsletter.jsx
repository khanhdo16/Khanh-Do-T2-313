import React from 'react'
import { Header, Button, Input, Form } from 'semantic-ui-react'

//Newsletter sign up form compoment
function Newsletter() {
    return <div className="newsletter">
        <Form className="newsletter">
            <Header as='h2'>NEWSLETTER SIGN</Header>
            <Form.Field inline>
                <Input placeholder='Enter your email' />
                <Button content='Subscribe' />
            </Form.Field>
        </Form>
    </div>
}

export default Newsletter