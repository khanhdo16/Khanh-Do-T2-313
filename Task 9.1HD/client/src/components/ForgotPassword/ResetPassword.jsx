import React, { useState } from 'react'
import { Segment, Message, Form, Button, Loader, Label } from 'semantic-ui-react'
import { useLocation } from 'react-router-dom'
// import { useAuth } from '../use-auth'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

function ResetPassword() {
    const query = useQuery()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    function sendRequest(event) {
        event.preventDefault()

        const { password, confirmpassword } = event.target.form.elements

        const data = {
            password: password.value,
            confirmpassword: confirmpassword.value
        }

        fetch('/resetpassword?token=' + query.get('token'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 200) {
                setTimeout(() => {
                    window.location.replace("/signin")
                }, 1000)
            }
            if(res.status === 400) {
                setSuccess(false)
                res.json()
                .then(data => {
                    setErrors(data)
                })
            }
        }) 
    }

    fetch('/resetpassword?token=' + query.get('token'))
    .then(res => {
        if(res.status === 200) {
            setTimeout(() => {
                setLoading(false)
            }, 1500)
        }
        if(res.status === 400) {
            window.location.replace("/forgot")
        }
    })

    return (
        <div style={{width: '50%', margin: '0 auto'}}>
            <Message
                id='form-title'
                attached
                header='Forgot Password'
            />
            <Segment attached='bottom' style={{padding: '2rem 5rem'}}>
                {loading
                    ? <Segment basic placeholder>
                        <Loader active>
                            Verifying reset link
                        </Loader>
                    </Segment>
                    : <Form>
                        <Message success visible={success}>
                            Reset password successfully.
                        </Message>
                        <Message error visible={errors.message != null}>
                            {errors.message}
                        </Message>
                        <Form.Field required>
                            <label>Password</label>
                            <input name='password' type='password' placeholder='••••••••' />
                            <Label className={errors.password ? undefined : 'hidden'}
                                color='red' pointing>{errors.password}</Label>
                        </Form.Field>
                        <Form.Field required>
                            <label>Confirm Password</label>
                            <input name='confirmpassword' type='password' placeholder='••••••••' />
                            <Label className={errors.confirmpassword ? undefined : 'hidden'}
                                color='red' pointing>{errors.confirmpassword}</Label>
                        </Form.Field>
                        <Button fluid color='green' onClick={sendRequest}>Reset password</Button>
                    </Form>
                }
            </Segment>
        </div>
    )
}

export default ResetPassword