import React, { useState, useEffect, useCallback } from 'react'
import { Segment, Form, Input } from 'semantic-ui-react'
import { UploadPreviewItem } from './PreviewItem'

export function UploadPreview({progress, imageMap, imageLinks, setImageLinks , handleChange}) {
    const [gallery, setGallery] = useState([])

    const updateGallery = useCallback(() => {
        if(imageLinks) {
            const imageList = imageLinks.map((link) => {
                return <UploadPreviewItem
                    key={link} link={link} imageMap={imageMap} progress={progress}
                    setImageLinks={setImageLinks} handleChange={handleChange}
                />
            })

            setGallery(imageList)
        }
    }, [imageLinks, progress, imageMap, setImageLinks, handleChange])

    useEffect(() => {
        updateGallery()
    }, [updateGallery])

    return (
        <Form.Field>
            <label>File Chosen: </label>
            {gallery && gallery.length > 0 ?
                <Segment.Group className='image-preview-container' horizontal>
                    {gallery}
                </Segment.Group>
                : 
                <Input fluid readOnly placeholder="Selected images will show here" />
            }
        </Form.Field>
    )
} 