# Soccer

## Backend:
* The backend is built using Node.js.
* It uses mysql2 for database operations and has a connection pool setup.
* The backend supports user authentication using bcrypt for password hashing and jsonwebtoken for JWT token management.
* There are several API endpoints including:
  * /randomPlayer: Fetches a random player from the database.
  * /register: Registers a new user.
  * /login: Authenticates a user.
  * /saveScore: Saves a user's score.
  * /profile: Fetches a user's recent and top scores.
  * /globalScores: Fetches the top 5 global scores.

## Frontend:
* The frontend is built using React.
* The main application (App.js) uses react-router-dom for routing.
* There are several components including:
  * GuessPlayer: Handles the gameplay of "Guess the Player".
  * Navbar: Displays the navigation bar with correct guesses and a dropdown menu.
  * PlayerInfo: Displays basic information about a given soccer player.
  * GlobalScores: Shows the top 5 global scores.
  * Login: Provides the UI and logic for user login.
  * Register: Provides the UI and logic for registering a new user.
  * Profile: Displays a user's recent and top scores.

## Docker:
This project uses Docker to containerize both the frontend and backend services.

### Frontend Service:

Build Context: The frontend Docker image is built using the context ./frontend/soccer and the Dockerfile located in the same directory.
Ports: The frontend service is mapped to port 3000 on the host and port 3000 inside the container.
Dependency: The frontend service depends on the backend service, meaning the backend service will start first.

### Backend Service:

Build Context: The backend Docker image is built using the context ./backend and the Dockerfile located in that directory.
Ports: The backend service is mapped to port 8000 on the host and port 3001 inside the container.
Environment Variables: The backend service has several environment variables, including database connection details, API key, and JWT secret.

## Kubernetes
This project uses Kubernetes to orchestrate and manage the deployment of the frontend and backend services to Google's Kubernetes Engine. 

### Backend Deployment:

Replicas: One replica of the backend pod is deployed.
Ports: The backend container exposes port 3001.
Environment Variables: The backend container gets its environment variables from Kubernetes secrets named app-secret. This is a secure way to manage sensitive information.

### Backend Service:

Ports: The service exposes port 3001 and routes traffic to the backend pods on the same port.
Selector: The service routes traffic to pods with the label app: backend.

### Frontend Deployment:

Replicas: One replica of the frontend pod is deployed.
Ports: The frontend container exposes port 3000.

### Frontend Service:

Type: The service type is LoadBalancer, which means it will provision an external IP to expose the service outside the cluster.
Ports: The service exposes port 80 and routes traffic to the frontend pods on port 3000.
Selector: The service routes traffic to pods with the label app: frontend.

#### This entire project was created by Brandon DaSilva | BDaSilva03
