import React, { useState } from 'react'
import { Segment, Message, Form, Button } from 'semantic-ui-react'
// import { useAuth } from '../use-auth'

function ForgotPassword() {
    const [success, setSuccess] = useState(false)

    function sendRequest(event) {
        event.preventDefault()

        const { email} = event.target.form.elements

        const data = {
            email: email.value
        }

        fetch('/forgot', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => {
            setSuccess(true)
        })
    }

    return (
        <div style={{width: '50%', margin: '0 auto'}}>
            <Message
                id='form-title'
                attached
                header='Forgot Password'
            />
            <Segment attached='bottom' style={{padding: '2rem 5rem'}}>
                <Form>
                    <Message success visible={success}>
                        If there is an account with this email. You will receive the instructions to reset your password soon.
                    </Message>
                    <Form.Field>
                        <label>Email</label>
                        <input name='email' type='email' placeholder='email@example.com' />
                    </Form.Field>
                    <Button fluid color='green' onClick={sendRequest}>Send reset link</Button>
                </Form>
            </Segment>
        </div>
    )
}

export default ForgotPassword