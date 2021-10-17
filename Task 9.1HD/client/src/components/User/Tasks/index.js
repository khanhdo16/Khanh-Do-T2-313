import React, { useState, useEffect } from 'react'
import { Message, Segment, Header } from 'semantic-ui-react'
import { useAuth } from '../../../use-auth'
import { UserTaskResult } from './Result'
import './UserTask.css'


function UserTask() {
    const auth = useAuth()
    const [tasks, setTaskList] = useState([])


    useEffect(() => {
        if(auth.user._id && auth.user.role === 'customer') {
            fetch('/user/' + auth.user._id + '/task')
            .then(response => {
                if(response.status === 200) {
                    response.json()
                    .then(data => {
                        setTaskList(data)
                    })  
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Message
                id='form-title'
                attached
                header='My Tasks'
            />
            <Segment attached='bottom'>
                {(tasks.length === 0 || !tasks)
                    ? <Header as='h5' content='No results found.' />
                    : <UserTaskResult tasks={tasks} setTaskList={setTaskList} />
                }
            </Segment>
        </div>
    )
}

export default UserTask