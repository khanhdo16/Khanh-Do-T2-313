import React, { useState } from 'react'
import { Segment, Message, Form, Checkbox, Button, Divider, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../use-auth'

function SignIn() {
    const [error, setError] = useState(false)
    const auth = useAuth()

    function authenticate(event) {
        event.preventDefault()

        const { email, password, rememberMe} = event.target.form.elements

        const data = {
            email: email.value,
            password: password.value,
            rememberMe: rememberMe.checked
        }

        fetch('/signin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 400) {
                setError(true)
            }
            if(res.status === 200) {
                setError(false)

                auth.signin('customer')
            }
        })
    }

    return (
        <div style={{width: '50%', margin: '0 auto'}}>
            <Message id='form-title'  attached>
                <Message.Header>
                    Sign In
                </Message.Header>
            </Message>
            <Segment attached='bottom' style={{padding: '2rem 5rem'}}>
                <Form>
                    <Message error visible={error}>
                        Incorrect email or password.
                    </Message>
                    <Form.Field>
                        <label>Email</label>
                        <input name='email' type='email' placeholder='email@example.com' />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input name='password' type='password' placeholder='••••••••' />
                    </Form.Field>
                    <div style={{paddingBottom: '10px', textAlign: 'right'}}>
                        <Link to="/forgot">Forgot password?</Link>
                    </div>
                    <Form.Field style={{textAlign: 'center'}}>
                        <Checkbox name='rememberMe' label='Remember me?' />
                    </Form.Field>
                    <Button.Group fluid>
                        <Button color='green' onClick={authenticate}>Sign in</Button>
                        <Button as='a' href='/signup'>Sign up</Button>
                    </Button.Group>
                </Form>
                <Divider horizontal>Or</Divider>
                {/* http://localhost:5000 */}
                <Button fluid color='red' onClick={() => {window.open('/auth/google', "_self")}}>
                    <Icon name='google' />
                    Sign in with Google
                </Button>
            </Segment>
            <Segment>
                <Button href='/expert' fluid icon labelPosition='right'>
                    Sign in as Expert?
                    <Icon name='right arrow' />
                </Button>
            </Segment>
        </div>
    )
}

export default SignIn