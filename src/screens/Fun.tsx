import * as React from 'react';
import GameboyColor from "../emulators/gbc/GameboyColor"
import HeaderWithSpacer from "../components/HeaderWithSpacer";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GameboyColorLogo from '../emulators/gbc/images/gbc_logo.svg';
import GameboyAdvanceLogo from '../emulators/gba/images/gba_logo.svg';
import SnesLogo from '../emulators/snes/images/snes_logo.svg';
import N64Logo from '../emulators/n64/images/n64_logo.svg';

/**
 * Interface for creating a "Fun" component that contains ported emulator functionality.
 */
interface IFunState {
    tabIndex: number
}

const TabImageStyle = {
    height: "calc(50%)",
    minHeight: "75px",
    minWidth: "75px",
    width: "calc(50%)",
};

/**
 * Fun page. Will eventually display multiple things, at the moment only GBC is ported to WASM.
 * @constructor
 */
class Fun extends React.Component<{}, IFunState> {

    constructor(props :any) {
        super(props);

        this.state = {
            tabIndex: 0
        }
    }

    public render()
    {
        return (
            <div>
                <HeaderWithSpacer />
                <AppBar
                    color={"default"}
                    position="static"
                >
                    <Tabs
                        centered={true}
                        fullWidth={true}
                        indicatorColor="primary"
                        onChange={this.handleTabChange}
                        scrollButtons="off"
                        value={this.state.tabIndex}
                    >
                        <Tab
                            disableRipple={true}
                            icon={
                                <img
                                    alt={"Gameboy Color"}
                                    src={GameboyColorLogo}
                                    style={TabImageStyle}
                                />
                            }
                        />
                        <Tab
                            disabled={true}
                            disableRipple={true}
                            icon={
                                <img
                                    alt={"Gameboy Advance"}
                                    src={GameboyAdvanceLogo}
                                    style={TabImageStyle}
                                />
                            }
                        />
                        <Tab
                            disabled={true}
                            disableRipple={true}
                            icon={
                                <img
                                    alt={"SNES"}
                                    src={SnesLogo}
                                    style={TabImageStyle}
                                />
                            }
                        />
                        <Tab
                            disabled={true}
                            disableRipple={true}
                            icon={
                                <img
                                    alt={"N64"}
                                    src={N64Logo}
                                    style={TabImageStyle}
                                />
                            }
                        />
                    </Tabs>
                </AppBar>
                {this.state.tabIndex === 0 && <GameboyColor/>}
            </div>
        );
    }

    /**
     * Handles a tab click by the user.
     */
    private handleTabChange = (event :any, newValue :number) => {
        this.setState({tabIndex: newValue});
    };
}

export default Fun;
