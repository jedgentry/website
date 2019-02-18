// TODO: Currently breaks MaterialUI tab switching, needs tweaking.
import * as React from 'react';
import Tab from "@material-ui/core/Tab";

// const styles = () => ({
//     button: {
//         border: 1,
//         color: "white",
//         margin: 0,
//     },
//     input: {
//         display: 'none',
//     },
// });

/**
 * Interface for creating a selectable tab that displays an image.
 */
interface IImageTabProps {
    image: any,
    disabled: boolean
}

/**
 * Shows a tab button with a image in it.
 * @param props Image tab properties for the
 * @constructor
 */
const ImageTab: React.FunctionComponent<IImageTabProps> = (props :IImageTabProps) => {
    return (
            <Tab
                disabled={props.disabled}
                disableRipple={true}
                icon={
                    <img
                        alt={"Click me!"}
                        src={props.image}
                        style={{
                            height: "calc(50%)",
                            minHeight: "75px",
                            minWidth: "75px",
                            width: "calc(50%)",
                        }}
                    />
                }
            />
    );
};

export default ImageTab;