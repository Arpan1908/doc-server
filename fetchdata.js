// fetchData.js
const { request, gql } = require('graphql-request');

const graphqlAPI = process.env.GRAPHQL_API;

const getPosts = async () => {
  try {
    const query = gql`
      query MyQuery {
        postsConnection {
          edges {
            node {
              createdAt
              slug
              title
              excerpt
              author {
                name
                id
                biography
              }
            }
          }
        }
      }
    `;

    const result = await request(graphqlAPI, query);
    console.log(result.postsConnection.edges);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Rethrow the error for further investigation
  }
};

const fetchData = async () => {
  try {
    const posts = await getPosts();
    console.log('Fetched Posts:', posts);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
