# Datasage-HORECA

Hospitality analytics platform.

## Getting Started

Ensure Docker and Docker Compose are installed.

```bash
docker-compose -f infra/docker-compose.yml up --build
```

This will start:

- Postgres database (db)
- API service at http://localhost:3000
- Forecast service at http://localhost:8000
- Webapp at http://localhost:3001

## Development

- Add your ML models in `/services/forecast`.
- Add database migrations and entities in `/services/api`.
- To work on the React webapp:
  ```bash
  cd webapp
  npm install     # install dependencies (react-router-dom, etc.)
  npm start       # runs generate-data, then starts dev server on http://localhost:3001
  ```
  
Copy your company logo (e.g. `logo.png`) into `webapp/public/`, so it is served at `/logo.png` in the sidebar.

## Infrastructure

- Terraform configurations are in `/infra/terraform`.