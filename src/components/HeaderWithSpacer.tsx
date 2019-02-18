import * as React from "react";
import Header from "./Header";

/**
 * Constructs a header with a spacer. Used to work around the "fixed" positioning of the header for the top most
 * page elements.
 * @constructor
 */
const HeaderWithSpacer: React.FunctionComponent = () => {
    return (
        <div>
            <Header/>
            <div className={"App-header-spacer"}/>
        </div>
    );
};

export default HeaderWithSpacer;
