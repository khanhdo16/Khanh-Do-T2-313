import React, { useState, useEffect, useCallback } from 'react'
import { Message, Input, Segment, Grid, Header, Form, Button } from 'semantic-ui-react'
import { FindResult } from '../components/find_task/Result'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import './css/FindTask.css'


export function FindTask() {
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

    const searchCallback = useCallback(() => {
        console.log(searchFilter)
        const url = new URL('/task', 'http://localhost:3000/')
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
              
    }, [searchFilter, setTaskList])

    useEffect(() => {
        searchCallback()
    }, [tasks, searchCallback])

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
                        <Segment fluid>
                            <Header content='Filter' />
                            <Form fluid>
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
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {(tasks.length === 0 || !tasks)
                            ? <Header as='h5' content='No results found.' />
                            : <FindResult tasks={tasks} setTaskList={setTaskList} />
                        }
                    </Grid.Column>
                </Grid.Row>
                </Grid>
            </Segment>
        </div>
    )
}