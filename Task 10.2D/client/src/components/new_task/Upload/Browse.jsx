import React from 'react'
import { Button, Input, Icon } from 'semantic-ui-react'

export function UploadBrowse({ imageMap, setImageLinks}) {
    function handleChange(event) {
        const files = event.target.files

        const selectedFiles = Array.from(files).map((file) => {
            const link = URL.createObjectURL(file)
            imageMap.set(link, file)

            return link
        })

        setImageLinks(preValue => {
            return [
                ...preValue,
                ...selectedFiles
            ]
        })
    }

    return (
        <div>
            <Button as="label" htmlFor="file" animated='fade' style={{ marginBottom: "20px" }} fluid>
                <Button.Content visible>{imageMap.size > 0 ? 'Add more...' : 'Browse files...'}</Button.Content>
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
        </div>
    )
}