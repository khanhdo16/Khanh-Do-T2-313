import React, { useState, useEffect, useCallback } from 'react'
import { Image } from 'semantic-ui-react'

export function DetailsGallery({upload}) {
    const [gallery, setGallery] = useState(upload)

    const galleryCallback = useCallback(() => {
        if(upload) {
            const imageLinks = upload

            const imageList = imageLinks.map((link) => {

                return (
                    <Image
                        key={link} src={link.split('public')[1]}
                        className='image-preview'
                        wrapped
                    />
                )
            })

            setGallery(imageList)
        }
    }, [upload, setGallery])

    useEffect(() => {
        galleryCallback()
    }, [galleryCallback])

    return (
        <Image.Group className='image-preview-container'>
            {gallery}
        </Image.Group>
    )
}