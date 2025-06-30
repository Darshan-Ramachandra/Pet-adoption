# Pet Adoption Platform

## Overview
This project is a comprehensive pet adoption platform that allows users to connect with pets in need of a loving home. Users can create accounts, log in, and seamlessly add their pets for adoption. The platform also enables users to initiate donation campaigns to support the well-being of pets.

## Key Features
- **User Authentication:** Secure user accounts with Firebase authentication for a seamless and safe login experience.
- **Role-based Access Control:** Two distinct roles: "Admin" and "User," each with specific privileges and responsibilities.
- **Pet Adoption Management:** Users can add detailed information about pets, including images, descriptions, and adoption status. Admins have the authority to oversee and manage all pet listings.
- **Donation Campaigns:** Users can initiate donation campaigns to contribute to the welfare of pets. Integration of Stripe payment for secure and efficient donation processing.

## Tech Stack
### Frontend
- Developed using React and Vite for a fast and reactive user interface.
### Styling
- Tailwind CSS for utility-first styling.
- Vanilla CSS for custom styling.
- Daisy Ui
### Backend
- MongoDB for storing and managing pet data.
- Firebase for authentication.
### Payment Processing
- Integrated Stripe for secure and reliable payment processing.
### Authentication
- Implemented JSON Web Tokens (JWT) for secure user authentication and authorization.

## Live Site
[Visit the live site here](https://pet-adoption-platform-cc33e.web.app/)
## Server Site Github Repository 
[Visit Repository here](https://github.com/Rahidapriya/Pet-Adoption-Platform-Servers-Site) 

## Running the Project with Docker

This project provides a Docker-based setup for easy local development and deployment. The configuration uses Docker Compose to orchestrate the application and its MongoDB database.

### Requirements
- Docker and Docker Compose installed on your system.
- Node.js version `22.13.1-slim` is used for both frontend and backend services (as specified in the Dockerfiles).
- No environment variables are required by default, but you may provide a `.env` file if needed for your setup (see below).

### Services and Ports
- **js-root**: The main frontend application, served on port **4173** (mapped to `localhost:4173`).
- **js-Pet-Adoption-Platform-Servers-Site**: The backend server, served on port **5007** (mapped to `localhost:5007`).
- **mongo**: MongoDB database, running on port **27017** (mapped to `localhost:27017` for local development).

### Build and Run Instructions
1. Clone the repository and navigate to the project root.
2. Build and start all services using Docker Compose:
   
   ```bash
   docker compose up --build
   ```
   
   This will build the frontend and backend images, start the servers, and launch MongoDB with persistent storage.

3. Access the frontend application at [http://localhost:4173](http://localhost:4173).
4. The backend API will be available at [http://localhost:5007](http://localhost:5007).

### Special Configuration
- The application expects MongoDB to be available as a service named `mongo` (handled by Docker Compose).
- Persistent MongoDB data is stored in the `mongo-data` Docker volume.
- If you need to provide environment variables (such as API keys for Firebase or Stripe), create a `.env` file in the appropriate directory and uncomment the `env_file` line in the `docker-compose.yml`.
- Both frontend and backend run as non-root users for improved security.
- The frontend is served using Vite's preview server, and the backend uses `npm start`.

---

This setup ensures a consistent and reproducible environment for running the Pet Adoption Platform locally or in production using Docker.
