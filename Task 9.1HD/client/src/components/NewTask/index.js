import React, { useState, useEffect } from 'react'
import { Form, Message } from 'semantic-ui-react'
import TaskDescription from './Description'
import TaskDetails from './Details'
import TaskPrice from './Price'
import TaskType from './Type'
import TaskUpload from './Upload'
import './NewTask.css'
import { useAuth } from '../../use-auth'

function NewTask() {
    const auth = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState({})
    const [data, setData] = useState({
        type: '',
        title: '',
        description: '',
        suburb: '',
        date: '',
        price_type: '',
        amount: ''
    })

    const handleChange = (event, object) => {
        const { name, value, type } = object

        setData((preValue) => {
            if (type === 'radio') {
                return {
                    ...preValue,
                    [value]: name
                }
            }
            else if(type === 'upload') {
                return {
                    ...preValue,
                    [type]: value
                }
            }
            else {
                return {
                    ...preValue,
                    [name]: value
                }
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if(auth.user._id && auth.user.role === 'customer') {
            setLoading(true)

            data['user'] = auth.user._id
            
            fetch('/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((res) => {
                setLoading(false)
                if (res.status === 400) {
                    setSuccess(false)
                    res.json().then((err) => {
                        if(err) {
                            setError(err)
                        }
                    })
                }
                if (res.status === 200) {
                    setError({})
                    setSuccess(true)
                }
            })
            .catch(e => console.log(e))
        }
        else {
            alert('You must log in before posting')
        }
    }

    useEffect(() => {
        if(Object.keys(error).length > 0 || success === true) {
            document.getElementById('form-title').scrollIntoView(
                {behavior: 'smooth'}
            )
        }
    }, [error, success])

    return (
        <div>
            <Message
                id='form-title'
                attached
                header='New Task'
            />
            <Form
                className='bottom attached fluid segment'
                onSubmit={handleSubmit}
                loading={loading}
                success={success}
                error={Object.keys(error).length !== 0}
            >
                <Message
                    header='Task submitted succesfully'
                    success
                />
                <Message
                    header='There were some errors with your submission'
                    list={Object.values(error)}
                    error
                />
                <TaskType
                    data={data}
                    handleChange={handleChange}
                    error={error}
                />
                <TaskDescription
                    handleChange={handleChange}
                    error={error}
                />
                <TaskUpload 
                    handleChange={handleChange}
                />
                <TaskDetails
                    data={data}
                    handleChange={handleChange}
                    error={error}
                />
                <TaskPrice
                    data={data}
                    handleChange={handleChange}
                    error={error}
                />
                <Form.Button content='Post task' />
            </Form>
        </div>
    )
}

export default NewTask