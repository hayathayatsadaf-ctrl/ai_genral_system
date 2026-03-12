# Architecture Design

## 1. How would you scale this to 100k users?

To scale the system to 100k users:

* Deploy backend using Docker containers
* Use a load balancer such as NGINX
* Move MongoDB to a managed database service like MongoDB Atlas
* Use Redis for caching frequently requested data
* Use message queues (BullMQ or RabbitMQ) for background LLM processing

This allows the system to handle high traffic and process requests efficiently.

## 2. How would you reduce LLM cost?

To reduce LLM costs:

* Cache analysis results for repeated journal entries
* Avoid sending identical text to the LLM
* Use smaller models when possible
* Only analyze when a new journal entry is created

## 3. How would you cache repeated analysis?

Repeated analysis can be cached using Redis.

Steps:

* Generate a hash from the journal text
* Store the analysis result in Redis
* If the same text appears again, return the cached result instead of calling the LLM API.

This reduces API calls and improves performance.

## 4. How would you protect sensitive journal data?

Sensitive user data can be protected by:

* Using HTTPS for secure communication
* Encrypting database connections
* Implementing authentication (JWT)
* Applying access control
* Avoiding storing unnecessary personal information
