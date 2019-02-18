import {createMuiTheme} from "@material-ui/core/styles";

/**
 * Creates our default Material UI theme. This could later be changed to alternate based on the users preference.
 */
export default createMuiTheme({
    palette: {
        primary: {
            main: '#eeeeee',
        },
        secondary: {
            contrastText: '#f8fff1',
            light: '#ffffff',
            main: '#ffffff',
        },
        type: 'dark',
    },
    typography: {
        fontFamily: "Roboto",
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightMedium: 500,
        fontWeightRegular: 400,
    }
});
