# Animal Health Tracker API

Production-ready Express.js backend for an Animal Health Tracker application.

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** with **Mongoose**
- **dotenv** for environment configuration

## Project Structure

```
├── config/          # Database & app configuration
├── controllers/     # Request handlers (MVC)
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── middleware/      # Express middleware (logging, error handling)
├── services/        # Business logic layer
├── utils/           # Utilities (logger, AppError)
├── server.js        # Entry point
└── .env.example     # Environment template
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

3. **Start MongoDB** (ensure MongoDB is running locally or use a cloud instance)

4. **Run the server**
   ```bash
   npm start        # Production
   npm run dev      # Development (with watch)
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/animals` | List all animals |
| POST | `/api/animals` | Create animal |
| GET | `/api/animals/:id` | Get animal by ID |
| PUT | `/api/animals/:id` | Update animal |
| DELETE | `/api/animals/:id` | Delete animal |
| POST | `/api/animals/:id/health-records` | Add health record |

## Example: Create Animal

```json
POST /api/animals
{
  "name": "Max",
  "species": "Dog",
  "breed": "Labrador",
  "dateOfBirth": "2020-05-15"
}
```
