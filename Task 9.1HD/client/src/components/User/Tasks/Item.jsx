import React from 'react'
import { Card, Button } from 'semantic-ui-react'
import { UserTaskDetails } from './Details'

export function UserTaskItem({index, task, setSelectedTask, setTaskList}) {
    const image = task.upload[0] ? task.upload[0].split('public')[1] : undefined

    const meta = () => {
        let date = new Date(task.date)
        date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

        if(task.suburb) {
            return date + " | " + task.suburb
        }
        else {
            return date
        }
    }

    const showDetails = () => {
        setSelectedTask(<UserTaskDetails task={task} />)
    }

    const deleteTask = () => {
        fetch('/task', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({_id: task._id})
        })
        .then(res => {
            if(res.status === 200) {
                setTaskList(preValue => {
                    preValue.splice(index, 1)
                    return preValue
                })
            }
        })
    }

    const actions = (
        <div>
            <Button content='Show details' onClick={showDetails} />
            <Button content='Delete' color='red' onClick={deleteTask} />
        </div>
    )

    return (
        <Card className='task-card' image={image}
            header={task.title} meta={meta}
            description={task.description}
            extra={actions}
        />
    )
}