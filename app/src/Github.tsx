import { json2csv } from "json-2-csv";
import { getCSV, getCSVColumns } from "./Util";

const GITHUB_TOKEN = "banana";
const GITHUB_GRAPHQL_ENDPOINT = "/api/github/graphql"; // Proxied through Vite dev server

export async function queryGitHubGraphQL(searchQuery: string = "topic:dds org:bcgov") {
const query = `
query {
  search(query: "${searchQuery}", type: REPOSITORY, first: 100) {
    repositoryCount
    edges {
      node {
        ... on Repository {
          id
          nameWithOwner
          name
          description
          url
          homepageUrl
          createdAt
          updatedAt
          isPrivate
          licenseInfo {
            name
            url
          }
          primaryLanguage {
            name
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
}
  `;

  console.log('Executing GraphQL query with search:', searchQuery)
  console.log('Full query:', query.substring(0, 200) + '...')

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      // Optional: identify your app (highly recommended)
      "User-Agent": "My-TypeScript-App/1.0",
    },
    body: JSON.stringify({ query }),
  })
  
  console.log('Response status:', response.status, response.statusText)
  
  if (!response.ok) {
    console.error('HTTP error:', response.status, response.statusText)
    const errorText = await response.text()
    console.error('Error details:', errorText)
  }
  
  return response
}


export const getDDSRepos = async () => {
    try {
        const response = await queryGitHubGraphQL("topic:dds org:bcgov")
        const asText = await response.text()
        const parsed = JSON.parse(asText)
        
        if (parsed.errors) {
            console.error('GraphQL errors:', parsed.errors)
            return JSON.stringify({ 
                error: 'GraphQL query failed', 
                details: parsed.errors 
            }, null, 2)
        }
        
        const count = parsed.data?.search?.repositoryCount || 0
        console.log(`Found ${count} repos with topic:dds org:bcgov`)
        
        if (count === 0) {
            console.warn('Query returned 0 repos. This might mean:')
            console.warn('1. No repos have the "dds" topic in bcgov org')
            console.warn('2. Token lacks permissions to see them')
            console.warn('3. Repos are private and token needs "repo" scope')
        }
        
        return JSON.stringify(parsed, null, 2)
    } catch (error: any) {
        console.error('Request failed:', error)
        return JSON.stringify({ 
            error: 'Network error or CORS issue', 
            message: error.message,
            help: 'If CORS error: GitHub API may block browser requests. Try: 1) Use a backend proxy, 2) Check token is valid, 3) Ensure dev server allows CORS'
        }, null, 2)
    }
}

export const gretDDSReposCSVColumns = async () => {
    const repos = await getDDSRepos() 
    console.log(typeof repos)
    const reposJSON = JSON.parse(repos)
    const firstRepo = reposJSON.data.search.edges[0]
    const csv = getCSV(JSON.stringify(firstRepo))
    const csvColumns = getCSVColumns(csv)
    return csvColumns
}

// Diagnostic function to test different queries
export const diagnoseDDSRepos = async () => {
    const queries = [
        { name: "Original (topic:dds org:bcgov)", query: "topic:dds org:bcgov" },
        { name: "Just org:bcgov", query: "org:bcgov" },
        { name: "Just topic:dds", query: "topic:dds" },
        { name: "bcgov with DDS in name", query: "org:bcgov dds in:name" },
        { name: "bcgov with DDS in description", query: "org:bcgov dds in:description" },
    ]
    
    const results: any[] = []
    
    for (const q of queries) {
        console.log(`Testing: ${q.name}`)
        const response = await queryGitHubGraphQL(q.query)
        const asText = await response.text()
        const parsed = JSON.parse(asText)
        
        const count = parsed.data?.search?.repositoryCount || 0
        const edges = parsed.data?.search?.edges || []
        
        results.push({
            query: q.name,
            count: count,
            sampleRepos: edges.slice(0, 3).map((e: any) => ({
                name: e.node.nameWithOwner,
                topics: e.node.repositoryTopics.nodes.map((t: any) => t.topic.name)
            }))
        })
        
        console.log(`  → Found ${count} repos`)
        if (edges.length > 0) {
            console.log(`  → First repo: ${edges[0].node.nameWithOwner}`)
            console.log(`  → Topics:`, edges[0].node.repositoryTopics.nodes.map((t: any) => t.topic.name))
        }
    }
    
    return JSON.stringify(results, null, 2)
}
