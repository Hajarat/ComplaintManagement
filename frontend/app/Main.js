import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'
import { CookiesProvider, useCookies } from 'react-cookie'

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

import Container from './components/Container'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/Register'
import FlashMessages from './components/FlashMessages'
import HomeLoggedIn from './components/HomeLoggedIn'
import HomeLoggedOut from './components/HomeLoggedOut'
import ComplaintForm from './components/ComplaintForm'

function ComplaintManagementPortal() {
    const initialState = {
        flashMessages: []
    }
    function ourReducer(draft, action) {
        switch (action.type) {
            case "flashMessage":
                draft.flashMessages.push(action.value)
                return
        }
    }
    const [state, dispatch] = useImmerReducer(ourReducer, initialState)
    const [cookie, setCookie] = useCookies(['Username'])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header/>
                    <Container>
                    <Switch>
                        <Route path="/" exact>
                            {cookie.Username ? <HomeLoggedIn /> : <HomeLoggedOut />}
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="/complaint">
                            <ComplaintForm />
                        </Route>
                    </Switch>
                    </Container>
                    <Footer/>
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

ReactDOM.render(
    <CookiesProvider>
        <ComplaintManagementPortal />
    </CookiesProvider>
, document.querySelector("#app"))

if(module.hot) {
    module.hot.accept()
}