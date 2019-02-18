import Button from '@material-ui/core/Button';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import * as React from 'react';
import theme from '../../styles/Theme';

/**
 * Styles the header button.
 * @param buttonTheme A button theme from Material-UI.
 */
const HeaderButtonStyles = (buttonTheme: any) => ({
    button: {
        border: 1,
        color: "white",
        margin: buttonTheme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

/**
 * Constructs one button that is displayed in the header to match style across multiple buttons.
 * @param buttonName The text to display in the button.
 * @constructor
 */
const HeaderButton: React.FunctionComponent<{buttonText?: string}> = ({buttonText}) => {
    return (
        <MuiThemeProvider theme={theme}>
                <Button
                    variant="flat"
                    disableRipple={true}
                    disableFocusRipple={true}
                    size={"small"}
                    style={{
                        textDecoration: "none"
                    }}
                >
                    <p style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        textDecoration: "none"
                    }}>
                        {buttonText}
                    </p>
                </Button>
        </MuiThemeProvider>
    );
};

export default withStyles(HeaderButtonStyles)(HeaderButton);