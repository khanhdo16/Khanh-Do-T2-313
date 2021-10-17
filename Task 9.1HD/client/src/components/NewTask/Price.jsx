import React from 'react'
import { Form, Label, Input, Message } from 'semantic-ui-react'

function TaskPrice(props) {
    return (
        <div className='form-section'>
            <Message 
                header='Task budget'
            />
            <Form.Group inline>
                <Form.Radio
                    value='price_type'
                    name='total'
                    label='Total'
                    checked={props.data.price_type === 'total'}
                    onChange={props.handleChange}
                    error={props.error.price_type ? true : false}
                />
                <Form.Radio
                    value='price_type'
                    name='hourly'
                    label='Hourly rate'
                    checked={props.data.price_type === 'hourly'}
                    onChange={props.handleChange}
                    error={props.error.price_type ? true : false}
                />
            </Form.Group>
            <Form.Field required error={props.error.amount ? true : false}>
                <Input
                    name='amount'
                    labelPosition='left'
                    type='number'
                    step='0.1'
                    placeholder='Amount'
                    onChange={props.handleChange}
                >
                    <Label basic>$</Label>
                    <input />
                </Input>
            </Form.Field>
        </div>
    )
}

export default TaskPrice