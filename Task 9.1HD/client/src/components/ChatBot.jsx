import React, { useState, useEffect } from 'react'
import { useAuth } from '../use-auth'

const ChatBot = () => {
    const auth = useAuth()
    const [details, setDetails] = useState({})
    const [status, send] = useState(false)

    function initChatBot() {
        if(!window.watsonAssistantChatOptions) {
            window.watsonAssistantChatOptions = {
                integrationID: "4d574456-15fb-45d6-af32-1d4355fbfef6", // The ID of this integration.
                region: "us-east", // The region your integration is hosted in.
                serviceInstanceID: "0949f00e-b357-4dd6-b12f-4b8894f285a1", // The ID of your service instance.
                onLoad: function(instance) {
                    instance.on({ type: "receive", handler: handleChange});
                    instance.on({ type: "send", handler: handleConfirm })
                
                    instance.render()
                }
              };
            setTimeout(function(){
              const t=document.createElement('script');
              t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js"
              document.head.appendChild(t);
            })
        }
        if((!auth.user || auth.user.role !== 'customer') && window.watsonAssistantChatOptions) {
            window.watsonAssistantChatOptions = undefined
        }
    }

    function handleChange(object) {
        const temp = object.data ? object.data.context.skills['actions skill'].skill_variables : null
        const data = {}

        if(temp != null) {
            for(let [key, value] of Object.entries(temp)) {
                if(key === 'type') {
                    if(value === 'In person') value = 'in_person'
                    if(value === 'Online') value = 'online'
                }

                if(key === 'price_type') {
                    if(value === 'Total') value = 'total'
                    if(value === 'Hourly rate') value = 'hourly'
                }

                if(key === 'date') {
                    value = value.value
                }

                data[key] = value
            }

            setDetails(data)
        }
    }

    function handleConfirm(object) {
        const confirm = object.data.input.text

        if(confirm === 'Yes') {
            send(true)
        }
    }

    useEffect(() => {
        initChatBot()
    })

    useEffect(() => {
        if(status) {
            details['user'] = auth.user._id

            fetch('/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            })
            .then((res) => {
                send(false)
                if (res.status === 200) {
                    alert('Task created successfully!')
                }
                if (res.status === 400) {
                    alert('Task created failed. Please try again later!')
                }
            })
        } // eslint-disable-next-line
    }, [status, details]) 

    return <div></div>
}

export default ChatBot