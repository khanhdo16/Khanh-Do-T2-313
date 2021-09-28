import React, { useState, useEffect } from 'react'
import { Form, Message } from 'semantic-ui-react'
import TaskDescription from '../components/new_task/Description'
import TaskDetails from '../components/new_task/Details'
import TaskPrice from '../components/new_task/Price'
import TaskType from '../components/new_task/Type'
import './css/Task.css'

function Task() {
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
        setLoading(true)
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
                    console.log(err)
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

    useEffect(() => {
        document.getElementById('form-title').scrollIntoView(
            {behavior: 'smooth'}
        )
    }, [error, success])

    return (
        <div>
            <Message
                id='form-title'
                attached
                header='New Task'
            />
            <Form
                className='attached fluid segment'
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

export default Task