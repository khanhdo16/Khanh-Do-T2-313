import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Icon, Segment, Image, Label, Progress, Confirm } from 'semantic-ui-react'
import axios from "axios"
import '../css/Upload.css'

function TaskUpload(props) {
    const [imageMap] = useState(new Map())
    const [imageLinks, setImageLinks] = useState(null)
    const [gallery, setGallery] = useState(null)
    const [progress, setProgress] = useState(null)
    const [confirm, setConfirm] = useState(false)
    const uploaded = []

    const deleteImage = useCallback(event => {
        const { src } = event.currentTarget.parentElement.lastElementChild

        if(imageMap && src) {
            imageMap.delete(src)
            const temp = Array.from(imageMap.keys())

            setImageLinks(temp)
        }
    }, [imageMap])

    const updateGalleryCallback = useCallback(updateGallery, [imageLinks, deleteImage, imageMap, progress])

    function updateGallery() {
        let label = (
            <Label
                as='a' color='red' corner='right'
                onClick={progress ? null : deleteImage} icon='trash'
            />
        )

        if(imageLinks && imageLinks.length > 0) {
            setGallery(
                imageLinks.map((link) => {
                    let style = ((imageMap && imageMap.get(link)) && progress && progress[imageMap.get(link).name])
                                ? { paddingBottom: '30px' } : {}

                    return (
                        <Segment style={style} key={link} className='image-segment' loading={(progress && progress[imageMap.get(link).name] !== 100)}>
                            {((imageMap && imageMap.get(link)) && progress && progress[imageMap.get(link).name]) ?
                                <Label attached='bottom' className='progress-bar'>
                                    <Progress
                                        percent={progress[imageMap.get(link).name]}
                                        autoSuccess
                                        progress
                                        error={imageMap.get(link)}
                                    />
                                </Label> : <div></div>
                            }
                            <Image
                                wrapped
                                className='image-preview'
                                src={link}
                                label={!imageMap.has(link) || !progress || ((imageMap && imageMap.get(link)) && progress && progress[imageMap.get(link).name] !== 100) ? label : undefined }
                            />
                        </Segment>
                    )
                })
            )
        }
    }

    function handleChange(event) {
        const files = event.target.files

        Array.from(files).map((file) => {
            return imageMap.set(URL.createObjectURL(file), file)
        })

        console.log(imageMap)
        
        setImageLinks(Array.from(imageMap.keys()))
    }

    function handleUpload(event) {
        event.preventDefault()
        setConfirm(false)

        console.log(event)

        const customUploadProgress = (fileId) => (progress) => {
            let percentage = Math.floor((progress.loaded * 100) / progress.total)
            setProgress((preValue) => {
                return {
                    ...preValue,
                    [fileId]: percentage
                }
            })
        }

        for(let [link, file] of imageMap) {
            console.log(link)
            let config = {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: customUploadProgress(file.name)
            }

            const data = new FormData()

            data.append('image', file)
            
            axios.post('/upload', data, config)
            .then(res => {
                console.log(res)
                if(res.status === 200) {
                    imageMap.delete(link)
                    uploaded.push(res.data.path)

                    props.handleChange(null, {
                        type: 'upload',
                        value: uploaded
                    })
                }
                if(res.status === 400) {
                    console.log()
                }
            })
        }
    }

    useEffect(() => {
        updateGalleryCallback()
    }, [imageLinks, updateGalleryCallback])

    return (
        <Form.Field>
            <label>Add image(s): </label>
            <Segment>
                <Button disabled={progress !== null} as="label" htmlFor="file" animated='fade' style={{ marginBottom: "20px" }} fluid>
                    <Button.Content visible>Browse files...</Button.Content>
                    <Button.Content hidden>
                    <Icon.Group>
                        <Icon name='image' />
                        <Icon corner='top right' name='add' />
                    </Icon.Group>
                    </Button.Content>
                </Button>
                <Input
                    id='file'
                    name='image'
                    type='file'
                    accept="image/*"
                    multiple
                    style={{display: 'none'}}
                    onChange={handleChange}
                />
                <Form.Field>
                    <label>File Chosen: </label>
                    {imageLinks && imageLinks.length > 0 && gallery ?
                        <Segment.Group className='image-preview-container' horizontal>
                            {gallery}
                        </Segment.Group>
                        : 
                        <Input fluid readOnly placeholder="Selected images will show here" />
                    }
                </Form.Field>
                <Button
                    disabled={(!imageLinks || imageLinks.length === 0 || progress !== null) || (imageMap.size !== imageLinks.length)}
                    onClick={(e) => {
                        e.preventDefault()
                        setConfirm(true)
                    }}
                    content={imageLinks && (imageMap.size === imageLinks.length) ? 'Upload' : 'Retry failed upload(s)'}
                />
                <Confirm content="Confirm your upload selection again, you won't be able to make any changes."
                    open={confirm} onConfirm={handleUpload} onCancel={() => setConfirm(false)} />
            </Segment>
        </Form.Field>
    )
}

export default TaskUpload