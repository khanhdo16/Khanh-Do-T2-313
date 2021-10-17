import React, { useState, useEffect, useCallback } from 'react'
import { Message, Input, Segment, Grid, Header, Form, Button, Modal, Divider, Checkbox } from 'semantic-ui-react'
import { FindResult } from './Result'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import './FindTask.css'
import Map from '../Map/Map'
import { useAuth } from '../../use-auth'


function FindTask() {
    const auth = useAuth()
    const [map, setMap] = useState(false)
    const [tasks, setTaskList] = useState([])
    const [searchFilter, setSearchFilter] = useState({
        search: '',
        suburb: '',
        date: '',
    })

    function handleClick(event, object) {
        event.preventDefault()
        const { suburb, date } = event.target.form.elements

        setSearchFilter(preValue => {
            return {
                ...preValue,
                suburb: suburb.value.toLowerCase(),
                date: date.value.split(' - '),
            }
        })
    }

    function handleSearch(event) {
        if(event.key === 'Enter')
        {
            const { value } = event.target

            setSearchFilter(preValue => {
                return {
                    ...preValue,
                    search: value.toLowerCase()
                }
            })
        }
    }

    function showAcceptedTask(event, { checked }) {
        event.preventDefault()

        if(checked)
        {
            const accepted = tasks.filter(task => {
                return task.expert && task.expert === auth.user._id
            })
    
            setTaskList(accepted)
        }
        else {
            setSearchFilter({
                search: '',
                suburb: '',
                date: '',
            })
        }
    }

    const searchCallback = useCallback(() => {
        const url = new URL('/task', 'https://sit313-khanhdo-iservice.herokuapp.com/')
        url.search = new URLSearchParams(searchFilter).toString()

        fetch(url)
        .then(response => {
            if(response.status === 200) {
                response.json()
                .then(data => {
                    setTaskList(data)
                })  
            }
        })
              
    }, [searchFilter])

    useEffect(() => {
        searchCallback()
    }, [searchCallback])

    return (
        <div>
            <Message
                id='form-title'
                attached
                header='Find Task'
            />
            <Segment attached='bottom'>
                <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Input fluid icon='search' placeholder='Search title...' onKeyPress={handleSearch} />
                        <Segment>
                            <Header content='Filter' />
                            <Form>
                                <Form.Field>
                                    <Checkbox label='Show my accepted tasks' onChange={showAcceptedTask} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Suburb</label>
                                    <input name='suburb' placeholder='Melbourne' />
                                </Form.Field>
                                <Form.Field className='search-date'>
                                    <label>Date</label>
                                    <SemanticDatepicker
                                        name='date'
                                        format='DD/MM/YYYY'
                                        pointing='bottom left'
                                        type='range'
                                    />
                                </Form.Field>
                                <Button content='Apply' onClick={handleClick} />
                            </Form>
                        </Segment>
                        <Divider />
                        <Button content='Show map' fluid onClick={() => {setMap(true)}} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {(tasks.length === 0 || !tasks)
                            ? <Header as='h5' content='No results found.' />
                            : <FindResult tasks={tasks} setTaskList={setTaskList} />
                        }
                    </Grid.Column>
                </Grid.Row>
                </Grid>
                <Modal open={map} closeIcon onClose={() => {setMap(false)}}>
                    <Segment style={{position: 'relative', height: '500px', margin: 0}}>
                        <Map />
                    </Segment>
                </Modal>
            </Segment>
        </div>
    )
}

export default FindTask