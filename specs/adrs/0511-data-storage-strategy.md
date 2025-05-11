# Use /sets Endpoint for Cache up to date Check
Our app fetches a large set of Pokémon card data from an external API. 
Since the data doesn't change frequently, we want to avoid fetching it every time the app loads. 
However, the API does not support ETag or Last-Modified headers for conditional requests. 
We need a way to determine whether to reuse cached data or refresh it.

## Considered Options

* Always fetch the full card data from the API
* Use a fixed cache expiration timer (e.g., every day)
* Use the `/sets` endpoint to detect changes in content

## Decision Outcome

Chosen option: **Use the `/sets` endpoint**, because it provides a reliable signal of whether new cards are available.

### Consequences

* Good, because it reduces unnecessary API calls
* Good, because it's efficient — `/sets` returns much smaller payloads than `/cards`
* Bad, because it requires more request on startup

### Confirmation

* Implement logic to store the latest known set ID in localStorage
* On load, compare the latest ID from `/sets` to the stored one
* If changed, invalidate and refresh card data
* Still waiting for TA approval for the API

## Pros and Cons of the Options

### Always Fetch

* Good, because data is always up to date
* Bad, because it increases bandwidth and slows down load times

### Time-Based Cache

* Good, because it's simple to implement
* Bad, because it might unnecessary refresh or miss new updates

### `/sets` Comparison

* Good, because it's accurate and efficient
* Good, because it avoids downloading full datasets unless needed
* Bad, because it assumes new sets mean new relevant card data (which is not always the case)

## More Information

* [PokéTCG.io /sets Documentation](https://docs.pokemontcg.io/api-reference/sets)

