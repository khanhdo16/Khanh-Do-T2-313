import React from 'react'
import { Form, TextArea, Input, Message } from 'semantic-ui-react'

function TaskDescription(props) {
    return (
        <div className='form-section'>
            <Message 
                header='Task description'
            />
            <Form.Field required error={props.error.title ? true : false}>
                <label>Task title</label>
                <Input
                    name='title'
                    placeholder='Enter task title'
                    type='text'
                    onChange={props.handleChange}
                />
            </Form.Field>
            <Form.Field required error={props.error.description ? true : false}>
                <label>Description</label>
                <TextArea
                    name='description'
                    placeholder='Enter task description'
                    type='text'
                    onChange={props.handleChange}
                />
            </Form.Field>
        </div>
    )
}

export default TaskDescription