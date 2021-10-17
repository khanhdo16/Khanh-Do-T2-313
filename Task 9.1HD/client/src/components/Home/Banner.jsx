import React from 'react'
import '../css/Banner.css'

//Banner component
function Banner(props) {
    return <img className='banner' src={props.src} alt=""></img>
}

export default Banner