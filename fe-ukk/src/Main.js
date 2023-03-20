import React from "react"
import { Route, Switch } from "react-router-dom";
import Home from "./Pages/Home"
import About from "./Pages/About"
import Contact from "./Pages/Contact"

class Main extends React.Component{
    render(){
        return (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
            </Switch>
        )
    }
}
export default Main;
