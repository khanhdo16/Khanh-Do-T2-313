import React from 'react'
import { Form, Input, Message } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers'

function TaskDetails(props) {
    const removePastDates = (date) => {
        let current = new Date()
        if(date.getTime() < current.getTime()) return false
        return true
    }
    return (
        <div className='form-section'>
            <Message 
                header='Task details'
            />
            <Form.Field
                required
                hidden={props.data.type !== 'in_person'}
                error={props.error.suburb ? true : false}
            >
                <label>Suburb</label>
                <Input
                    name='suburb'
                    placeholder='Enter a suburb'
                    type='text'
                    onChange={props.handleChange}
                />
            </Form.Field>
            <Form.Field required error={props.error.date ? true : false}>
                <label>Date</label>
                <SemanticDatepicker
                    name='date'
                    format='DD/MM/YYYY'
                    pointing='top left'
                    onChange={props.handleChange}
                    filterDate={removePastDates}
                />
            </Form.Field>
        </div>
    )
}

export default TaskDetails