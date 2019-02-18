import axios from 'axios';

/**
 * The API Manager handles making requests and caching. Cache objects do not have a timed
 * expiration since the data is rarely expected to change. However, objects are removed
 * from the cache if the size of the cache gets too large.
 */
class APIManagerSingleton {

    /**
     * These variables keep track of the highest number, since the highest will always be the most recent.
     * Each ID number always starts from 0, so the low end does not need to be tracked.
     */
    public highestBlogIdNumber :number;
    public highestProjectIdNumber :number;

    /**
     * The cache is hashed by blog-id key to content payload.
     * e.g: 1: Key: Value, Key: value.
     */
    private blogCache: {};

    /**
     * The cache is hashed by project-id key to content payload.
     * e.g: 1: Key: Value, Key: value.
     */
    private projectCache: {};

    /**
     * These cache limits are used to not have the users memory grow too large when someday we have too many entries.
     */
    private readonly PROJECT_CACHE_LIMIT = 200;
    private readonly BLOG_CACHE_LIMIT = 100;
    private readonly CACHE_CLEAR_AMOUNT = 10;

    /**
     * This is the URL to the lambda API. It's public. Hope my wallet is ok.
     */
    private readonly LAMBDA_QUERY_DB_API_ENDPOINT = "https://1c647epl4a.execute-api.us-west-2.amazonaws.com/default/personal-website-get-data/";
    private readonly API_VERSION = "v1/";
    private readonly GET_BLOG = "get-blog/";
    private readonly GET_PROJECT = "get-project/";
    private readonly GET_LATEST = "get-latest/";

    /**
     * Behavior to
     */
    private readonly CACHE_CLEAR_ENUM = {
        BOTTOM: 0,
        TOP: 1
    };

    constructor() {
        this.highestBlogIdNumber = -1;
        this.highestProjectIdNumber = -1;
        this.blogCache = {};
        this.projectCache = {};
    }

    /**
     * Queries the latest API versions to get the latest entries.
     */
    public async getLatestEntries() {
        // Verify that we actually need to query.
        if(this.highestBlogIdNumber < 0 || this.highestProjectIdNumber < 0 ) {
            await this.getHighestBlogAndProjectNumbers();
        }

        if(Object.keys(this.blogCache).length === 0) {
            await this.queryBlogPostRange(this.highestBlogIdNumber - 5, this.highestBlogIdNumber);
        }

        if(Object.keys(this.projectCache).length === 0) {
            await this.queryProjectRange(this.highestProjectIdNumber - 5, this.highestProjectIdNumber);
        }
    }

    /**
     * Queries for blog posts within the id range given. If the values are cached, returns the cache first.
     * @param start The start of the range to query.
     * @param end The end of the range to query.
     */
    public queryBlogPostRange = async (start: number, end: number) => {
        if(this.highestBlogIdNumber < 0) {
            await this.getHighestBlogAndProjectNumbers();
        }

        start = Math.max(start, 0);
        end = Math.min(end, this.highestBlogIdNumber);
        if (!this.isRangeInObject(start, end, this.blogCache)) {
            await this.performBlogQuery(start, end);
        }
        return this.copyKeyRangeToArray(start, end, this.blogCache);
    };

    /**
     * Queries for an individual blog post, checking the cache first. This is most likely used for viewing a single
     * blog post. This also checks the cache first.
     * @param id The id of the blog post to check on.
     */
    public queryIndividualBlogPost = async (id: number) => {
        if (this.blogCache[id] !== undefined) {
            return this.blogCache[id];
        }
        await this.performBlogQuery(id, id + 1);
        return this.blogCache[id];
    };

    /**
     * Queries a range of projects from start to end.
     * @param start The start of projects to display.
     * @param end The end of projects to display.
     */
    public queryProjectRange = async (start: number, end: number) => {
        if(this.highestProjectIdNumber < 0) {
            await this.getHighestBlogAndProjectNumbers();
        }

        start = Math.max(start, 0);
        end = Math.min(end, this.highestProjectIdNumber);
        if (!this.isRangeInObject(start, end, this.projectCache)) {
            await this.performProjectQuery(start, end);
        }
        return this.copyKeyRangeToArray(start, end, this.projectCache);
    };

    /**
     * Gets the highest indices of blogs and projects in order to query efficiently.
     */
    private async getHighestBlogAndProjectNumbers() {
        const response = await axios.get(this.LAMBDA_QUERY_DB_API_ENDPOINT + this.API_VERSION + this.GET_LATEST);
        this.highestBlogIdNumber = response.data['latest-blog'];
        this.highestProjectIdNumber = response.data['latest-project'];
    }

    /**
     * Performs a query on projects. Adds them into the cache no matter what. If a max cache size is hit, it will delete
     * the opposite of the range (e.g if you query with id 50 and the max size is 50, it'll delete 0 - (end - start).
     * @param start The starting project to query.
     * @param end The ending project to query.
     */
    private performProjectQuery = async (start: number, end: number) => {
        return await this.queryApi(start, end, this.GET_PROJECT,"project-id", this.projectCache,
            this.PROJECT_CACHE_LIMIT);
    };

    /**
     * Performs a query for blog posts in the given range to the database. If a max cache size is hit, it will delete
     * the opposite of the range (e.g if you query with id 50 and the max size is 50, it'll delete 0 - (end - start).
     * @param start The starting blog id to query.
     * @param end The ending blog id to query.
     */
    private performBlogQuery = async (start: number, end: number) => {
        return await this.queryApi(start, end, this.GET_BLOG, "blog-id", this.blogCache, this.BLOG_CACHE_LIMIT);
    };

    /**
     * Queries the API based on the given information and returns the query result.
     * @param start The start index id to query from.
     * @param end The end index id to query from.
     * @param url The URL endpoint to query.
     * @param cacheKey The key that we are using to store in our cache.
     * @param cache The cache where we are storing the K/V pairs based on the cacheKey and query results.
     * @param cacheSizeLimit The maximum limit, when hit, will clean up some items in the cache.
     */
    private queryApi = async (start: number, end: number, url: string, cacheKey: string, cache: {},
                              cacheSizeLimit: number) => {
        // Build query string.
        const query = "?start=" + start.toString() + "&end=" + end.toString();
        const response = await axios.get(this.LAMBDA_QUERY_DB_API_ENDPOINT + this.API_VERSION + url + query);
        console.log("Query Response: " + response);
        for(const item of response.data) {
            cache[item[cacheKey]] = item;
        }
        // Check if the cache is now too large and empty it to make room.
        this.maybeClearCache(start, end, cache, cacheSizeLimit);
        // Copy values over and return them.
        return this.copyKeyRangeToArray(start, end, cache);
    };

    /**
     * Maybe invokes cache clearing if a threshold is met.
     * @param start The start of the search.
     * @param end The end of the search.
     * @param cache The cache to clear if we pass the limit.
     * @param sizeLimit The limit that if passed, will start clearing cache items.
     */
    private maybeClearCache(start: number, end: number, cache: {}, sizeLimit: number) {
        // Check if the cache is now too large and empty it to make room.
        if(end > sizeLimit/ 2) {
            this.clearCache(this.projectCache, sizeLimit, this.CACHE_CLEAR_ENUM.BOTTOM);
        } else if(Object.keys(this.projectCache).length > sizeLimit) {
            this.clearCache(this.projectCache, sizeLimit, this.CACHE_CLEAR_ENUM.TOP);
        }
    }

    /**
     * Checks if a given range of keys is in an object.
     * @param start The start of the key range.
     * @param end The end of the key range.
     * @param cache The cache we are looking up.
     */
    private isRangeInObject = (start: number, end: number, cache: {}) => {
        for(let i = start; i < end; ++i) {
            if(cache[i] === undefined) {
                return false;
            }
        }

        return true;
    };

    /**
     * Copies a range of keys from one object to another.
     * @param start The start of the key range.
     * @param end The end of the key range.
     * @param cache The cache we are looking up values from.
     */
    private copyKeyRangeToArray = (start: number, end: number, cache: {}) => {
        const result = [];
        for(let i = start; i < end; ++i) {
            if(cache[i] !== undefined) {
                result.push(cache[i]);
            }
        }

        return result;
    };

    /**
     * Clears from the cache until the size threshold is met.
     * @param cache The cache to clear from.
     * @param cacheLimit The max number of items to exist in the cache.
     * @param cacheEnum The method to use when clearing.
     */
    private clearCache = (cache: {}, cacheLimit: number, cacheEnum: number) => {
        switch(cacheEnum) {
            case this.CACHE_CLEAR_ENUM.TOP:
                this.clearHighestCacheKeys(cache, cacheLimit);
                break;
            case this.CACHE_CLEAR_ENUM.BOTTOM:
                this.clearLowestCacheKeys(cache, cacheLimit);
                break;
            default:
                console.error("Invalid cache clear methodology was passed to clear cache!");
                break;
        }
    };

    /**
     * Clears the cache from highest keys until it fits the size limit.
     * @param cache The object lookup cache to clear from.
     * @param sizeLimit The number of keys that should be in the object.
     */
    private clearHighestCacheKeys = (cache: {}, sizeLimit: number) => {
        if(Object.keys(cache).length < sizeLimit) {
            return;
        }

        for(let i = sizeLimit; i < sizeLimit - this.CACHE_CLEAR_AMOUNT; i--) {
            const key = Math.max.apply(null, Object.keys(cache));
            delete cache[key];
        }
    };

    /**
     * Clears the cache from lowest keys until it fits the size limit.
     * @param cache The object lookup cache to clear from.
     * @param sizeLimit The number of keys that should be in the object.
     */
    private clearLowestCacheKeys = (cache: {}, sizeLimit: number) => {
        if(Object.keys(cache).length < sizeLimit) {
            return;
        }

        for(let i = sizeLimit; i < sizeLimit - this.CACHE_CLEAR_AMOUNT; i--) {
            const key = Math.min.apply(null, Object.keys(cache));
            delete cache[key];
        }
    };
}

const APIManager = new APIManagerSingleton();
export default APIManager;
