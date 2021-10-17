import '../../css/Upload.css'
import React, { useState } from 'react'
import { Form, Button, Segment, Message } from 'semantic-ui-react'
import axiosInstance from './axios'
import { UploadPreview } from './Preview'
import { UploadBrowse } from './Browse'

function TaskUpload({handleChange: propsHandleChange}) {
    const [imageMap] = useState(new Map())
    const [imageLinks, setImageLinks] = useState([])
    const [progress, setProgress] = useState(null)
    const [errors, setError] = useState([])

    function handleUpload(event) {
        event.preventDefault()
        setError([])

        const customUploadProgress = (fileId) => (progress) => {
            let percentage = Math.floor((progress.loaded * 100) / progress.total)
            setProgress((preValue) => {
                return {
                    ...preValue,
                    [fileId]: percentage
                }
            })
        }

        for(const [link, file] of imageMap) {
            if(file instanceof File) {
                const config = {
                    headers: {"Content-Type": "multipart/form-data"},
                    onUploadProgress: customUploadProgress(link)
                }
    
                const data = new FormData()
                data.append('image', file)
                
                axiosInstance.post('/task/upload', data, config)
                .then(res => {
                    if(res.status === 200) {
                        imageMap.set(link, res.data.path)
                        
                        const uploaded = Array.from(imageMap.values()).filter((file) => {
                            return (!(file instanceof File) && typeof file === 'string')
                        })
    
                        propsHandleChange(null, {
                            type: 'upload',
                            value: uploaded
                        })
                    }
                })
                .catch(error => {
                    if(error.response.status === 400) {
                        setProgress(preValue => {
                            return {
                                ...preValue,
                                [link]: 101
                            }
                        })

                        if(!errors.some(message => message === error.response.data.message)) {
                            setError(preValue => {
                                return [
                                    ...preValue,
                                    <Message.Item content={error.response.data.message} />
                                ]
                            })
                        }
                        
                        const selector = '[src="' + link + '"]'
                        document.querySelectorAll(selector)[0].scrollIntoView({behavior: 'smooth', block: 'nearest'});
                    }
                })
            }
        }
    }

    return (
        <Form.Field>
            <label>Add image(s): </label>
            <Segment>
                <UploadBrowse imageMap={imageMap} setImageLinks={setImageLinks} />
                <UploadPreview
                    imageMap={imageMap} imageLinks={imageLinks} progress={progress}
                    setImageLinks={setImageLinks} handleChange={propsHandleChange}
                />
            </Segment>
            <Message error visible={errors.length > 0}>
                <Message.Header>Some errors occurred when uploading</Message.Header>
                <Message.List items={errors} />
            </Message>
            <Button
                disabled={imageLinks <= 0}
                onClick={handleUpload}
                content='Upload'
            />
        </Form.Field>
    )
}

export default TaskUpload