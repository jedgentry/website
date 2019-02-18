import * as React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActions';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GithubLogo from "../../images/logos/GithubLogo";

/**
 * Styles for a project entry.
 */
const ProjectEntryStyles = {
    card: {
        borderColor: "#bfbdbe",
        borderStyle: "solid",
        borderWidth: "1px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "calc(100%)"
    },
    media: {
        height: 140,
        width: 140,
    },
};

/**
 * The interface for creating a project entry.
 */
interface IProjectProps {
    title: string,
    body: string,
    imageSrc: string,
    githubUrl: string,
}

/**
 * Displays one project card on the page.
 * @param props Details about the project, queried from the API.
 * @constructor
 */
const ProjectEntry: React.FunctionComponent<IProjectProps> = (props :IProjectProps) => {
    return (
        <div>
            <Card
                style={ProjectEntryStyles.card}
            >
                <CardActionArea>
                    <CardMedia
                        src={props.imageSrc}
                        image={props.imageSrc}
                        style={ProjectEntryStyles.media}
                    />
                    <CardContent>
                        <Typography
                            align={"left"}
                            gutterBottom={true}
                            variant={"display1"}
                        >
                            {props.title}
                        </Typography>
                        <Typography
                            align={"center"}
                            component="h4"
                        >
                            {props.body}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <a href={props.githubUrl}>
                        <IconButton
                            disableRipple={true}
                            disableTouchRipple={true}
                        >
                            <GithubLogo
                                style={{color: "rgb(63, 81, 181)"}}
                            />
                        </IconButton>
                    </a>
                    <Button
                        color="primary"
                        disableFocusRipple={true}
                        disableRipple={true}
                        size="small"
                    >
                        Learn More >
                    </Button>
                </CardActions>
            </Card>
            <div
                style={{
                    height: "1vh"
                }}
            />
        </div>
    );
};

export default withStyles(ProjectEntryStyles)(ProjectEntry);