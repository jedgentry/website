import * as React from "react";
import HeaderWithSpacer from "../components/HeaderWithSpacer";
import ProjectEntry from "../components/project/ProjectEntry";
import FooterButtons from "../components/buttons/FooterButtons";
import APIManager from "../managers/APIManager";

/**
 * Creates the state of the project page.
 */
interface IProjectState {
    currentProjectMax: number,
    currentProjectMin: number,
    projects: any[]
}

/**
 * Defines the projects page when "PROJECTS" is clicked.
 */
class Projects extends React.Component<{}, IProjectState> {

    private readonly PROJECTS_PER_PAGE = 5;

    constructor(props :any) {
        super(props);
        this.state = {
            currentProjectMax: 0,
            currentProjectMin: 0,
            projects: []
        };
    }

    public async componentDidMount() {
        // The highest numbers are most recent.
        this.setState({
            currentProjectMax: APIManager.highestBlogIdNumber,
            currentProjectMin: APIManager.highestBlogIdNumber - this.PROJECTS_PER_PAGE,
            projects: await APIManager.queryProjectRange(
                this.state.currentProjectMin,
                this.state.currentProjectMax + this.PROJECTS_PER_PAGE
            )
        });
    }

    public render() {
        return (
            <div>
                <HeaderWithSpacer/>
                <div
                    style={{
                        display: "inline-block",
                        padding: "calc(1%)",
                        textAlign: "center",
                        width: "calc(80%)",
                    }}
                >
                    {this.renderProjects()}
                    <FooterButtons
                        nextFunction={this.nextClicked}
                        previousFunction={this.previousClicked}
                    />
                </div>
            </div>
        );
    };

    /**
     * Renders projects based on what the user is currently viewing.
     */
    private renderProjects() {
        if(this.state.projects.length === 0) {
            return (
                <div>
                    No projects found, try refreshing the page.
                </div>
            );
        }

        return this.state.projects.map((item, i) => {
            return (
                <ProjectEntry
                    key={i}
                    title={item.title !== undefined ? item.title : "No title"}
                    body={item.body !== undefined ? item.body : "No body"}
                    imageSrc={item.image !== undefined ? item.image : null}
                    githubUrl={item.github !== undefined ? item.github : "No github"}
                />
            );
        });
    }

    /**
     * Called when the next button is clicked, queries the API.
     */
    private async nextClicked() {
        this.setState({
            currentProjectMax: Math.max(this.state.currentProjectMax - this.PROJECTS_PER_PAGE, 0),
            currentProjectMin: Math.max(this.state.currentProjectMin - this.PROJECTS_PER_PAGE, 0),
            projects: await APIManager.queryProjectRange(
                Math.max(this.state.currentProjectMin - this.PROJECTS_PER_PAGE, 0),
                Math.max(this.state.currentProjectMax - this.PROJECTS_PER_PAGE, 0))
        });
    }

    /**
     * Called when the previous button is clicked, queries the API.
     */
    private async previousClicked() {
        this.setState({
            currentProjectMax: Math.max(this.state.currentProjectMax + this.PROJECTS_PER_PAGE,
                APIManager.highestProjectIdNumber),
            currentProjectMin: Math.max(this.state.currentProjectMin + this.PROJECTS_PER_PAGE,
                APIManager.highestProjectIdNumber - this.PROJECTS_PER_PAGE),
            projects: await APIManager.queryProjectRange(
                Math.max(this.state.currentProjectMin + this.PROJECTS_PER_PAGE,
                    APIManager.highestProjectIdNumber - this.PROJECTS_PER_PAGE),
                Math.max(this.state.currentProjectMax + this.PROJECTS_PER_PAGE,
                    APIManager.highestProjectIdNumber))
        });
    }
}

export default Projects;
