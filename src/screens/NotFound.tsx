import * as React from "react";
import Header from "../components/Header";

const NotFound: React.FunctionComponent = () => {
    // @ts-ignore
    const YoutubeNotFound = <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/SHvhps47Lmc?controls=0?rel=0;&autoplay=1&autohide=1" frameBorder="0" allowFullScreen={true}/>;
    return (
        <div>
            <Header/>
            <div style={{
                height: "93.5vh",
                width: "100%"
            }}
            >
                {YoutubeNotFound}
            </div>
        </div>
    );
};

export default NotFound;
