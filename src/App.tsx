import './App.css';
import Blog from './screens/Blog';
import Home from './screens/Home';
import Projects from './screens/Projects';
import NotFound from './screens/NotFound';
import Fun from './screens/Fun';
import * as React from 'react';
import './fonts/Roboto-Light.ttf';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

/**
 * The App class sets up the routing of our web page.
 */
const App: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="App-content">
                    <Switch>
                        <Route exact={true} path="/" replace={true} component={Home}/>
                        <Route exact={true} path="/blog" replace={true} component={Blog}/>
                        <Route exact={true} path="/projects" replace={true} component={Projects}/>
                        <Route exact={true} path="/fun" replace={true} component={Fun}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
