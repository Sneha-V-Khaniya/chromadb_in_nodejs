import random
import string
import time
import numpy as np
from chromadb import Client
from chromadb.config import Settings

def generate_text(word_count=200):
    """Generate a random text string with the specified word count."""
    words = ["".join(random.choices(string.ascii_lowercase, k=random.randint(3, 10))) for _ in range(word_count)]
    return " ".join(words)

# Generate a new dataset with 50,000 entries
dataset = [{"id": f"id_{i}", "text": generate_text()} for i in range(10000)]
ids = [entry["id"] for entry in dataset]
documents = [entry["text"] for entry in dataset]

# Generate mock embeddings (assuming embedding size of 768)
embedding_size = 768
embeddings = np.random.rand(len(dataset), embedding_size).tolist()

# Initialize ChromaDB client
client = Client(Settings())

# Create or get a collection
collection_name = "benchmark_collection"
collection = client.get_or_create_collection(collection_name)

# Insert data
print("Starting data insertion...")
start_time = time.time()
for idx in range(len(dataset)):
    collection.add(
        ids=[ids[idx]],
        documents=[documents[idx]],
        embeddings=[embeddings[idx]]
    )
end_time = time.time()
print(f"Insertion Time: {end_time - start_time:.2f} seconds")

# Perform a search
print("Performing a search query...")
query_embedding = np.random.rand(embedding_size).tolist()
search_start = time.time()
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=10
)
search_end = time.time()
print(f"Search Time: {search_end - search_start:.2f} seconds")

# Print search results
print("Search Results:")
for result in results:
    print(result)
