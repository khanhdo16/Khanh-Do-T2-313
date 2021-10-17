import React, { useState, useEffect, useRef, useCallback, useContext, createContext } from "react"
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AES, enc } from 'crypto-js'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({children}) {
    const auth = useProvideAuth()

    return <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>

}

function useProvideAuth() {
    const cookies = {
        set: (data) => {
            const encrypted = AES.encrypt(JSON.stringify(data), 'KhanhDo217633519')
            Cookies.set('user', encrypted, {expires: data.expires ? new Date(data.expires) : data.expires})
        },
        get: () => {
            const encrypted = Cookies.get('user')
            
            if(encrypted) {
                const decrypted = AES.decrypt(encrypted, 'KhanhDo217633519').toString(enc.Utf8)
                return JSON.parse(decrypted)
            }

            return null
        }
    }

    const [user, setUser] = useStateCallback(cookies.get())
    const history = useHistory()    

    const signin = (role) => {
        const previous = history.location.state ? history.location.state.prev : '/'

        fetch('/auth', { credentials: 'include' })
        .then(res => {
            if(res.status === 200) {
                res.json()
                .then(data => {
                    if(role != null) data['role'] = role
                    
                    cookies.set(data)
                    setUser(data, () => {history.push(previous)})
                })
            }
        })
    }

    const logout = () => {
        // http://localhost:5000
        fetch('/logout').then(res => {
            if(res.status === 200) {
                Cookies.remove('user')
                setUser(null, () => history.push('/'))
            }
        })
    }

    return {
        user,
        signin,
        logout
    }
}

function useStateCallback(initialState) {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // init mutable ref container for callbacks
  
    const setStateCallback = useCallback((state, cb) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(state);
    }, []); // keep object reference stable, exactly like `useState`
  
    useEffect(() => {
      // cb.current is `null` on initial render, 
      // so we only invoke callback on state *updates*
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null; // reset callback after execution
      }
    }, [state]);
  
    return [state, setStateCallback];
  }