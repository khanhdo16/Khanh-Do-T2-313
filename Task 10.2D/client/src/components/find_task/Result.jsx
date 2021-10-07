import React, { useState } from 'react'
import { Card, Modal } from 'semantic-ui-react'
import { FindItem } from './Item'

export function FindResult({tasks, setTaskList}) {
    const [selectedTask, setSelectedTask] = useState(null)

    const taskList = tasks.map((task, index) => {
        return (
            <FindItem key={index} index={index} task={task}
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
            <Card.Group>
                {taskList}
            </Card.Group>
        </div>
    )
}