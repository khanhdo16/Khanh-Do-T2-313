import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

//Expert item component
function Expert(props) {
    return <Card>
        <Image src={props.image} wrapped ui={false} />
        <Card.Content>
        <Card.Header>{props.name}</Card.Header>
        <Card.Description>{'Description: ' + props.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Icon color='yellow' name='star' />
            { props.star > 1
            ? ' ' + props.star + ' stars'
            : ' ' + props.star + ' star' }
        </Card.Content>
    </Card>
}

export default Expert