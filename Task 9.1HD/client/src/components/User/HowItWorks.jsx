import React from 'react'
import { Step, Message, Segment } from 'semantic-ui-react'

const HowItWorks = () => {
    return (
        <div style={{width: '70%', margin: '0 auto'}}>
            <Message id='form-title' attached header='How it works?' />
            <Segment attached='bottom'>
                <Step.Group fluid>
                    <Step>
                        <Step.Content>
                            <Step.Title>Create task</Step.Title>
                            <Step.Description>Post new task with details and budget</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step>
                        <Step.Content>
                            <Step.Title>Wait for confirmation</Step.Title>
                            <Step.Description>An expert will be contacting you</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step>
                        <Step.Content>
                            <Step.Title>Confirm Order</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
                <p>
                At iService we’re obsessed with gadgets and gizmos. We’re the folks standing in line on launch day waiting for the latest smartphone or gaming console. We love all things tech and we’re experts at what we do.
                iService fixes electronic devices (it’s in our name after all). From the classic phone drop in the parking lot to the tablet in the toilet. We’ve seen it all. We understand how traumatic it is when you break your favorite devices and we want you to feel better the moment you walk in. 
                We’re not overly sentimental, but we do what we do because we care about people and their tech. That’s why uBreakiFix works; we put our customers above anything else. Of course, we love fixing cracked screens and broken charge ports, but we get our satisfaction from helping out folks who lost their connection to the outside world.
                </p>
            </Segment>
        </div>
    )
}

export default HowItWorks