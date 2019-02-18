import * as React from "react";
import Button from "@material-ui/core/Button";

/**
 * Interface for FooterButton props.
 */
interface IFooterButtonProps {
    nextFunction(): void;
    previousFunction(): void;
}

/**
 * Renders two footer buttons for previous and next pages.
 * @param props Takes in the function for when the next button and previous buttons are clicked.
 * @constructor
 */
const FooterButtons: React.StatelessComponent<IFooterButtonProps> = (props :IFooterButtonProps) => {
    return (
        <div>
            <Button
                color="primary"
                disableFocusRipple={true}
                disableRipple={true}
                onClick={props.previousFunction}
                size="large"
                style={{
                    margin: "calc(0.5%)",
                    width: "calc(25%)"
                }}
                variant="outlined"
            >
                {"< Previous"}
            </Button>
            <Button
                color="primary"
                disableFocusRipple={true}
                disableRipple={true}
                onClick={props.nextFunction}
                size="large"
                style={{
                    margin: "calc(0.5%)",
                    width: "calc(25%)"
                }}
                variant="outlined"
            >
                {"Next >"}
            </Button>
        </div>
    );
};

export default FooterButtons;
