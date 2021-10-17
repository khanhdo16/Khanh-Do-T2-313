import React, { useState, useMemo } from 'react'
import { Segment, Message, Form, Button, Dropdown, Divider } from 'semantic-ui-react'
import countryOptions from '../../data/countryList'

function SignUp() {
    const [errors, setErrors] = useState([])
    const [success, setSuccess] = useState(false)
    const data = {country: ''}

    function sendRequest(data) {
        fetch('/expert/signup', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 200) {
                setErrors([])
                setSuccess(true)
            }
            if(res.status === 400) {
                setSuccess(false)

                res.json()
                .then(data => {
                    if(Object.values(data).length > 0) {
                        const temp = Object.values(data).map((err) => {
                            return err
                        })
                        temp.sort()
                        setErrors(temp)
                    }
                    else setErrors([])
                })
            }

            document.getElementById('form-title').scrollIntoView({behavior: 'smooth'})
        })
    }

    function selectedCountry(event, object) {
        data['country'] = object.value
    }

    function handleSubmit(event) {
        event.preventDefault()

        const form = event.target.form.elements

        for(let i = 1; i <= 11; i++) {
            const name = form[i].name
            const value = form[i].value
            
            data[name] = value
        }

        sendRequest(data)        
    }

    const messageContent = useMemo(() => {
        if(errors.length > 0) {
            return (
                <Message error visible>
                    <Message.Header>Some errors occurred when signing up</Message.Header>
                    <Message.List items={errors} />
                </Message>
            )
        }
        if(success) {
            return <Message success visible>Signed up successfully!</Message>
        }
        
    }, [errors, success])

    return (
        <div style={{width: '50%', margin: '0 auto'}}>
            <Message
                id='form-title'
                attached
                header='Expert Sign Up'
            />
            <Segment attached='bottom' style={{padding: '2rem 5rem'}}>
                {messageContent}
                <Form>
                    <Form.Field required>
                        <label>Country</label>
                        <Dropdown
                            name='country'
                            placeholder='Select Country'
                            fluid
                            search
                            selection
                            onChange={selectedCountry}
                            options={countryOptions}
                        />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Input required fluid name ='department'
                            label='Department' placeholder='Phone Service' />
                        <Form.Input required fluid name ='position'
                            label='Position' placeholder='Phone technician' />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input required fluid name ='fname'
                            label='First name' placeholder='John' />
                        <Form.Input required fluid name ='lname'
                            label='Last name' placeholder='Doe' />
                    </Form.Group>
                    <Form.Field required>
                        <label>Email</label>
                        <input name='email' type='email'
                            placeholder='email@example.com' />
                    </Form.Field>
                    <Form.Field required>
                        <label>Password</label>
                        <input name='password' type='password'
                            placeholder='••••••••' />
                    </Form.Field>
                    <Form.Field required>
                        <label>Confirm password</label>
                        <input name='confirmpassword' type='password'
                            placeholder='••••••••' />
                    </Form.Field>
                    <Form.Field required>
                        <label>Address</label>
                        <input name='address' placeholder='Street number and name' />
                    </Form.Field>
                    <Form.Field>
                        <label>Address 2</label>
                        <input name='address2' placeholder='Apt, building, suite' />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Input required fluid name ='city' label='City'
                            placeholder='Burwood' />
                        <Form.Input required fluid name ='state'
                            label='State, Province or Region' placeholder='VIC' />
                    </Form.Group>
                    <Form.Field>
                        <label>Postal code</label>
                        <input name='postal' placeholder='3125' />
                    </Form.Field>
                    <Form.Field>
                        <label>Phone number</label>
                        <input name='phone' placeholder='0412345678' />
                    </Form.Field>
                    <Divider section />
                    <Button fluid color='green' onClick={handleSubmit}>Sign up</Button>
                </Form>
            </Segment>
        </div>
    )
}

export default SignUp