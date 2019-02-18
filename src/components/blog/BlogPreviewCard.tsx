import * as React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActions';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        borderColor: "#bfbdbe",
        borderStyle: "solid",
        borderWidth: "1px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "calc(80%)"
    },
    media: {
        height: 140,
        width: 140,
    },
};

interface IProjectProps {
    title: string,
    imageSrc: string,
    description: string,
    blogId: number
}

/**
 * Constructs a card that previews a blog post with a synopsis.
 * @param props Controls the display of the card.
 * @constructor
 */
const BlogPreviewCard: React.StatelessComponent<IProjectProps> = (props :IProjectProps) => {
    return (
        <div>
            <Card
                style={styles.card}
            >
                <CardActionArea>
                    <CardMedia
                        src={props.imageSrc}
                        title="Gearboy WASM Platform"
                        style={styles.media}
                        image={props.imageSrc}
                    />
                    <CardContent>
                        <Typography
                            component={"h2"}
                            gutterBottom={true}
                            variant={"display2"}
                        >
                            {props.title}
                        </Typography>
                        <Typography
                            component="h4"
                            style={{
                                float: "left"
                            }}
                        >
                            {props.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        color="primary"
                        disableTouchRipple={true}
                        style={{
                            float: "right"
                        }}
                        size="small"
                    >
                        Read More
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

export default withStyles(styles)(BlogPreviewCard);