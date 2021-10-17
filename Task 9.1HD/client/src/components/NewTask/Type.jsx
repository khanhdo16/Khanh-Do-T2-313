import React from 'react'
import { Form } from 'semantic-ui-react'

function TaskType(props) {
  return (
      <Form.Group inline>
        <label>Select task type:</label>
        <Form.Radio
          value='type'
          name='in_person'
          label='In person'
          checked={props.data.type === 'in_person'}
          onChange={props.handleChange}
          error={props.error.type ? true : false}
        />
        <Form.Radio
          value='type'
          name='online'
          label='Online'
          checked={props.data.type === 'online'}
          onChange={props.handleChange}
          error={props.error.type ? true : false}
        />
      </Form.Group>
  )
}

export default TaskType