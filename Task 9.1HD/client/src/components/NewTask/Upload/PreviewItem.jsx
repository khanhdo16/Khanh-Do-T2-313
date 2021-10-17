import React, { useMemo } from 'react'
import { Segment, Label, Progress, Image } from 'semantic-ui-react'

export function UploadPreviewItem({ link, progress, imageMap, setImageLinks, handleChange }) {
    const { ready, uploading, error, status } = useMemo(() => {
        return {
            uploading: (progress !== null && progress[link] < 100),
            success: (progress !== null && progress[link] === 100 ),
            error: (progress !== null && progress[link] === 101),
            get ready() {return (this.uploading || this.success || this.error)},
            get status() {
                if(this.success) {
                    return {
                        color: 'green',
                        text: 'Uploaded successfully'
                    }
                }
                if(this.error) {
                    return {
                        color: 'red',
                        text: 'Upload failed! Retry or remove.'
                    }
                }
                return false
            }
        }
    }, [progress, link])

    function deleteImage(event) {
        const { src } = event.currentTarget.parentElement.nextSibling

        if (src) {
            if (imageMap && imageMap.has(src)) {
                imageMap.delete(src)
                const temp = Array.from(imageMap.keys())

                setImageLinks(temp)

                const uploaded = Array.from(imageMap.values()).filter((file) => {
                    return (!(file instanceof File) && typeof file === 'string')
                })

                handleChange(null, {
                    type: 'upload',
                    value: uploaded
                })
            }
        }
    }

    let style = ready ? { paddingBottom: '30px' } : undefined

    let label = (
        <Label.Group className="image-label-group">
        <Label
            as='a' color='red' corner='right' icon='trash'
            onClick={deleteImage}
        />
        <Label
            className={status ? undefined : 'hidden'}
            color={status.color} attached='bottom'
            content={status.text}
        />
        </Label.Group>
    )
    

    return (
        <Segment style={style} key={link} className='image-segment' loading={uploading}>
            { ready ?
                <Label attached='bottom' className='progress-bar'>
                    <Progress
                        percent={ready ? progress[link] : 0}
                        autoSuccess
                        progress
                        error={error}
                    />
                </Label> : <div></div>
            }
            <Image
                wrapped
                className='image-preview'
                src={link}
                label={label}
            />
        </Segment>
    )
}