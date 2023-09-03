import dgraph from "dgraph-js"

const url = process.env.DGRAPH_URL
const apiKey = process.env.DGRAPH_ADMIN01_API_KEY

console.log("dgraph instance", url, apiKey)

const dgraphInstance = new dgraph.DgraphClient(dgraph.clientStubFromCloudEndpoint(url, apiKey))

// dgraphInstance.setDebugMode(true)

export default dgraphInstance
