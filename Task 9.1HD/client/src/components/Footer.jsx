import React from 'react'
import './css/Footer.css'
import Newsletter from './Newsletter'
import Social from './Social'

//Footer compoment
function Footer() {
    return <div className="footer">
        <Newsletter />
        <Social />
    </div>
}

export default Footer