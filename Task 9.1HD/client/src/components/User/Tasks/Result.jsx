import React, { useState } from 'react'
import { Card, Modal } from 'semantic-ui-react'
import { UserTaskItem } from './Item'

export function UserTaskResult({tasks, setTaskList}) {
    const [selectedTask, setSelectedTask] = useState(null)

    const taskList = tasks.map((task, index) => {
        return (
            <UserTaskItem key={index} index={index} task={task}
                setSelectedTask={setSelectedTask}
                setTaskList={setTaskList}
            />
        )
    })

    return (
        <div>
            <Modal
                open={selectedTask !== null}
                closeIcon
                content={selectedTask}
                onClose={() => {setSelectedTask(null)}}
                centered={false}
            />
            <Card.Group itemsPerRow={3}>
                {taskList}
            </Card.Group>
        </div>
    )
}