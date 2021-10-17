import React, { useState, useMemo, useEffect } from 'react'
import { Segment, Message, Form, Button, Dropdown, Divider } from 'semantic-ui-react'
import countryOptions from '../../data/countryList'
import { useAuth } from '../../use-auth'

function Profile() {
    const auth = useAuth()
    const [errors, setErrors] = useState([])
    const [success, setSuccess] = useState(false)
    const data = {country: ''}
    const [profile, setProfile] = useState({
        country: '', fname: '',  lname: '', email: '',
        address: '',  address2: '',  city: '',
        postal: '', state: '', phone: ''
    })

    
    useEffect(() => {
        if(auth.user) {
            fetch('/user/' + auth.user._id)
            .then(res => {
                if(res.status === 200) {
                    res.json()
                    .then(data => {
                        setProfile(data)
                    })
                }
                if(res.status === 400) {
                    window.location.replace('/')
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function sendRequest(data) {
        fetch('/user/' + auth.user._id, {
            method: 'PATCH',
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
        setProfile(preValue => {
            return {
                ...preValue,
                country: object.value
            }
        })
    }

    function handleChange(event) {
        const { name, value } = event.target
        setProfile(preValue => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()

        const form = event.target.form.elements

        data['country'] = profile.country

        for(let i = 1; i <= 9; i++) {
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
                    <Message.Header>Some errors occurred when updating profile</Message.Header>
                    <Message.List items={errors} />
                </Message>
            )
        }
        if(success) {
            return <Message success visible>Updated profile successfully!</Message>
        }
        
    }, [errors, success])

    return (
        <div style={{width: '50%', margin: '0 auto'}}>
            <Message
                id='form-title'
                attached
                header='Profile'
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
                            value={profile.country}
                        />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Input required fluid name ='fname' label='First name'
                            placeholder='John' value={profile.fname} onChange={handleChange} />
                        <Form.Input required fluid name ='lname' label='Last name'
                            placeholder='Doe'  value={profile.lname} onChange={handleChange} />
                    </Form.Group>
                    <Form.Field required>
                        <label>Email</label>
                        <Form.Input name='email' type='email' value={profile.email}
                            placeholder='email@example.com' onChange={handleChange} />
                    </Form.Field>
                    <Form.Field required>
                        <label>Address</label>
                        <Form.Input name='address' placeholder='Street number and name'
                            value={profile.address} onChange={handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Address 2</label>
                        <Form.Input name='address2' placeholder='Apt, building, suite'
                            value={profile.address2} onChange={handleChange} />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Input required fluid name ='city' label='City'
                            placeholder='Burwood' value={profile.city} />
                        <Form.Input required fluid name ='state' value={profile.state}
                            label='State, Province or Region' placeholder='VIC' />
                    </Form.Group>
                    <Form.Field>
                        <label>Postal code</label>
                        <Form.Input name='postal' placeholder='3125' value={profile.postal}
                            onChange={handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Phone number</label>
                        <Form.Input name='phone' placeholder='0412345678' value={profile.phone}
                            onChange={handleChange} />
                    </Form.Field>
                    <Divider section />
                    <Button fluid color='green' onClick={handleSubmit}>Update profile</Button>
                </Form>
            </Segment>
        </div>
    )
}

export default Profile