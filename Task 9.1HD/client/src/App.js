import './App.css'
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Routes from './components/Routes'
import ChatBot from './components/ChatBot'
import { useAuth } from './use-auth'

//iService App compoment
function App() {
  const auth = useAuth()

  return (
    <div className="App">
        <Header />
        <main>
          <Routes />
        </main>
        <Footer />
        {auth.user && auth.user.role === 'customer' ? <ChatBot /> : undefined}
    </div>
  );
}

export default App;
