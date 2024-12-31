
const { ChromaClient } = require("chromadb");
const client = new ChromaClient({ baseUrl: "http://localhost:8000" });


// Generate sample data
const generateData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `doc_${i}`,
    document: `This is a sample document number ${i}. It contains some 200 words. Repeat this text multiple times to simulate actual data.`,
  }));
};

// Insert data into ChromaDB
const insertData = async (collection, data) => {
  console.time("Insertion Time");

  // Extract ids and documents into separate arrays
  const ids = data.map((item) => item.id);
  const documents = data.map((item) => item.document);

  // Use collection.add to insert data in one go
  await collection.upsert({
    documents,
    ids,
  });

  console.timeEnd("Insertion Time");
};

// Query data from ChromaDB
const queryData = async (collection, query) => {
  console.time("Query Time");

  const results = await collection.query({
    queryTexts: query, // Chroma will embed this for you
    nResults: 8, // how many results to return
  });

  console.timeEnd("Query Time");
  console.log("Query Results:", results);
};

// Main function to run benchmark
const runBenchmark = async () => {
  const data = generateData(10000); // Generate 10k entries
  const queryText = "random query sample document";

  console.log("Benchmarking ChromaDB with 10k entries and query:", queryText);

  try {
    // Create collection
    const collection = await client.getOrCreateCollection({
      name: "collection_123",
    });

    // Insert Data
    await insertData(collection, data);

    // Query Data
    await queryData(collection, queryText);
  } catch (error) {
    console.error("Error during benchmark:", error.message);
    console.error("Error details:", error.response?.data || error);
  }
};

// Run the benchmark
runBenchmark();
