import * as React from "react";
import HeaderWithSpacer from "../components/HeaderWithSpacer";
import BlogPreviewCard from "../components/blog/BlogPreviewCard";
import APIManager from "../managers/APIManager";
import FooterButtons from "../components/buttons/FooterButtons";

/**
 * Creates the state of the Blog page.
 */
interface IBlogState {
    blogs: any[],
    currentBlogMax: number,
    currentBlogMin: number,
}

/**
 * Defines the blog page when "Blog" is clicked.
 */
class Blog extends React.Component<{}, IBlogState> {

    private readonly BLOG_POSTS_PER_PAGE = 5;

    constructor(props :any) {
        super(props);
        this.state = {
            blogs: [],
            currentBlogMax: 0,
            currentBlogMin: 0
        }
    }

    public async componentDidMount() {
        // The highest numbers are most recent.
        this.setState({
            blogs: await APIManager.queryProjectRange(
                this.state.currentBlogMin,
                this.state.currentBlogMax + this.BLOG_POSTS_PER_PAGE
            ),
            currentBlogMax: APIManager.highestBlogIdNumber,
            currentBlogMin: APIManager.highestBlogIdNumber - this.BLOG_POSTS_PER_PAGE
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
                        width: "calc(80%)"
                    }}
                >
                    {this.renderBlogPosts()}
                </div>
                <FooterButtons
                    nextFunction={this.nextClicked}
                    previousFunction={this.previousClicked}
                />
            </div>
        );
    };

    /**
     * Renders blog posts based on what the user is currently viewing.
     */
    private renderBlogPosts() {
        if(this.state.blogs.length === 0) {
            return (
                <div>
                    No blog posts found, try refreshing the page.
                </div>
            );
        }

        return this.state.blogs.map((item, i) => {
            return (
                <BlogPreviewCard
                    key={i}
                    title={item.title !== undefined ? item.title : "No title"}
                    description={item.description !== undefined ? item.description : "No description"}
                    imageSrc={item.image !== undefined ? item.image : null}
                    blogId={item.blogId !== undefined ? item.blogId : "No blogId"}
                />
            );
        });
    }

    /**
     * Called when the next button is clicked, queries the API.
     */
    private async nextClicked() {
        this.setState({
            blogs: await APIManager.queryProjectRange(
                Math.max(this.state.currentBlogMin - this.BLOG_POSTS_PER_PAGE, 0),
                Math.max(this.state.currentBlogMax - this.BLOG_POSTS_PER_PAGE, 0)),
            currentBlogMax: Math.max(this.state.currentBlogMax - this.BLOG_POSTS_PER_PAGE, 0),
            currentBlogMin: Math.max(this.state.currentBlogMin - this.BLOG_POSTS_PER_PAGE, 0)
        });
    }

    /**
     * Called when the previous button is clicked, queries the API.
     */
    private async previousClicked() {
        this.setState({
            blogs: await APIManager.queryProjectRange(
                Math.max(this.state.currentBlogMin + this.BLOG_POSTS_PER_PAGE,
                    APIManager.highestProjectIdNumber - this.BLOG_POSTS_PER_PAGE),
                Math.max(this.state.currentBlogMax + this.BLOG_POSTS_PER_PAGE,
                    APIManager.highestProjectIdNumber)),
            currentBlogMax: Math.max(this.state.currentBlogMax + this.BLOG_POSTS_PER_PAGE,
                APIManager.highestProjectIdNumber),
            currentBlogMin: Math.max(this.state.currentBlogMin + this.BLOG_POSTS_PER_PAGE,
                APIManager.highestProjectIdNumber - this.BLOG_POSTS_PER_PAGE)
        });
    }
}

export default Blog;
