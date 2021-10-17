import React, { useMemo, useState } from 'react'
import { Message, Segment, Header, Label, Button } from 'semantic-ui-react'
import { DetailsGallery } from './Gallery'
import { useAuth } from '../../use-auth'

export function FindDetails({task}) {
    const auth = useAuth()
    const [done, setDone] = useState({task: false, expert: false})

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

    function handleAccept(event) {
        if(auth.user._id && auth.user.role === 'expert' && task._id) {
            fetch('/task/' + task._id, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'expert': auth.user._id})
            })
            .then(res => {
                if(res.status === 200) {
                    setDone(preValue => {
                        return {
                            ...preValue,
                            task: true
                        }
                    })
                }
            })

            let data = []

            if(auth.user.tasks && Array.isArray(auth.user.tasks) && auth.user.tasks.length > 0)  data = auth.user.tasks
            
            data.push(task._id)

            fetch('/expert/' + auth.user._id, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'tasks': data})
            })
            .then(res => {
                if(res.status === 200) {
                    setDone(preValue => {
                        return {
                            ...preValue,
                            expert: true
                        }
                    })
                }
            })
        }
    }

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
                <Button color='green' content={(done.task && done.expert) || task.expert != null ? 'Accepted' : 'Accept'}
                    onClick={handleAccept} disabled={(done.task && done.expert) || task.expert != null}
                />
            </Segment>
        </div>
    )
}