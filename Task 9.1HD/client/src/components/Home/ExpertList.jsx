import React from "react";
import { Card } from 'semantic-ui-react'
import expertList from "../../data/expertList"
import Expert from "./Expert";

//Expert grid component
function ExpertList() {
    return <Card.Group itemsPerRow={3}>
        {expertList.map((expert) => {
            return <Expert
                key = {expert.key}
                image = {expert.image}
                name = {expert.name}
                description = {expert.description}
                star = {expert.star}
            />
        })}
    </Card.Group>
}

export default ExpertList