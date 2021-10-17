import React, { useMemo } from 'react'
import { Message, Segment, Header, Label } from 'semantic-ui-react'
import { DetailsGallery } from './Gallery'

export function UserTaskDetails({task}) {
    const type = useMemo(() => {
        if(task.type === 'in_person') {
            return 'In person'
        }
        if(task.type === 'online') {
            return 'Online'
        }
    }, [task.type])

    const date = useMemo(() => {
        if(task.date) {
            const temp = new Date(task.date)
            return temp.getDate() + '/' + (temp.getMonth() + 1) +
                    '/' +  temp.getFullYear();
        }
    }, [task.date])

    const price = useMemo(() => {
        if(task.price_type && task.amount) {
            let price

            if(task.price_type === 'total') price = 'Total:'
            if(task.price_type === 'hourly') price = 'Hourly rate:'

            price += " $" + task.amount

            return price
        }
    }, [task.price_type, task.amount])


    return (
        <div>
            <Message
                attached
                header='Task Details'
            />
            <Segment attached>
                {task.upload !== null && task.upload.length > 0 
                    ? <DetailsGallery upload={task.upload} />
                    : undefined
                }

                <Header as='h2' dividing>{task.title}</Header>
                <Label.Group>
                    <Label color='orange'>{'Date: ' + date}</Label>
                    <Label color='blue'>{'Type: ' + type}</Label>
                    {task.type === 'in_person'
                        ? <Label color='olive'>{'Suburb: ' + task.suburb}</Label>
                        : undefined
                    }
                </Label.Group>

                <Header as='h3' dividing>Price</Header>
                <p style={{fontSize: '18px'}}>{price}</p>

                <Header as='h3' dividing>Description</Header>
                <p style={{fontSize: '16px'}}>{task.description}</p>
            </Segment>
            <Segment attached='bottom'>
                <Header style={task.expert != null ? undefined : {display: 'none'}} color='green' as='h2' content='Accepted' />
            </Segment>
        </div>
    )
}