import React from "react";
import { useAuth } from '../use-auth'
import { Route, Switch, Redirect } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Home from "./Home/Home";
import NotFound from "./NotFound";
import NewTask from "./NewTask";
import FindTask from "./FindTask";
import SignIn from "./User/SignIn";
import SignUp from "./User/SignUp";
import GoogleSignIn from "./User/GoogleSignIn";
import GoogleSignUp from "./User/GoogleSignUp";
import Payment from "./User/Payment";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ForgotPassword/ResetPassword";
import Profile from "./User/Profile";
import ExpertSignIn from "./Expert/SignIn";
import ExpertSignUp from "./Expert/SignUp";
import HowItWorks from "./User/HowItWorks";
import UserTask from "./User/Tasks";

const stripePromise = loadStripe(
    "pk_test_51HZ0GBABqJ9IhHyXV3GKGG6y9JvnkCB6MUUTlbqZ5mBV6FtyjWUkp8g7pKTmyeOpojBR09SQRmuzjXW1nvyyIpoV00OsTsnbLY"
);

const StripePaymentForm = () => {
    return (
        <Elements stripe={stripePromise}>
            <Payment />
        </Elements>
    )
}

const RouteWithAuth = ({path, success, failed, exact}) => {
    const auth = useAuth()

    return (
        <Route exact={exact} path={path} render={() => {
            if(auth.user) {
                if(auth.user.role === 'expert') {
                    if(path === '/task' || path === '/expert')
                        return success
                }
    
                if(auth.user.role === 'customer') {
                    if( path === '/task/create' || path === '/payment' || path === '/task/user'
                        || path === '/expert/signup' || path === '/profile'
                    ) {
                        return success
                    }
                }
            }
            else {
                if( path === '/signin' || path === '/google/signin' || path === '/expert'
                    || path === '/signup' || path === '/google/signup' || path === '/expert/signup'
                ) {
                    return success
                }
            }

            return <Redirect to={failed || '/'} />
        }} />
    )
}

const Routes = () => {
    return (
        <Switch>
            <Route path="/" component={Home} exact />
                <RouteWithAuth path="/signin" success={<SignIn />} />
                <RouteWithAuth path="/signup" success={<SignUp />} />
                <Route path='/forgot' component={ForgotPassword} />
                <Route path='/resetpassword' component={ResetPassword} />
                <RouteWithAuth path='/profile' success={<Profile />} />

            <RouteWithAuth path="/google/signin" success={<GoogleSignIn />} />
            <RouteWithAuth path="/google/signup" success={<GoogleSignUp />} />

            <RouteWithAuth path="/task" success={<FindTask />} exact />
                <RouteWithAuth path="/task/create" success={<NewTask />} />
                <RouteWithAuth path="/task/user" success={<UserTask />} />

            <RouteWithAuth path="/payment" success={<StripePaymentForm />} />

            <Route path="/about" component={HowItWorks} exact />

            <RouteWithAuth path='/expert' success={<ExpertSignIn />} exact />
                <RouteWithAuth path='/expert/signup' success={<ExpertSignUp />} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default Routes;
