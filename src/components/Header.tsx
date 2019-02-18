import '../App.css';
import HeaderButton from '../components/buttons/HeaderButton';
import theme from '../styles/Theme';
import IconButton from '@material-ui/core/IconButton';
import {Home} from '@material-ui/icons';
import LinkedInLogo from '../images/logos/LinkedInLogo';
import GithubLogo from '../images/logos/GithubLogo';
import {MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {NavLink} from 'react-router-dom';

/**
 * Defines properties for a header icon button.
 */
const HeaderIconButtonProps = {
    disableRipple: true,
    disableTouchRipple: true,
    style: {color: "white"},
};

/**
 * Constructs a Header element.
 * @constructor
 */
const Header: React.FunctionComponent = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <header className="App-header" style={{height:"6.5%"}}>
                <NavLink to={"/"}>
                    <IconButton
                        {...HeaderIconButtonProps}
                    >
                        <Home/>
                    </IconButton>
                </NavLink>
                <NavLink to={"/blog"}>
                    <HeaderButton buttonText="Blog" />
                </NavLink>
                <NavLink to={"/projects"}>
                    <HeaderButton buttonText="Projects" />
                </NavLink>
                <NavLink to={"/fun"}>
                    <HeaderButton buttonText="Fun" />
                </NavLink>
                <a href ="https://github.com/jedgentry/">
                    <IconButton
                        {...HeaderIconButtonProps}
                    >
                        <GithubLogo
                            style={{color: "white"}}
                        />
                    </IconButton>
                </a>
                <a href ="https://www.linkedin.com/in/jedgentry/">
                    <IconButton
                        {...HeaderIconButtonProps}
                    >
                        <LinkedInLogo
                            style={{color: "white"}}
                        />
                    </IconButton>
                </a>
            </header>
        </MuiThemeProvider>
    );
};

export default Header;
