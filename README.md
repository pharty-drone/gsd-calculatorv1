# GSD Calculator v1

A secure web-based Ground Sample Distance (GSD) Calculator for drone mapping.

## Development

### Backend

```
cd server
npm install
npm start
```

### Frontend

```
cd client
npm install
npm start
```

The frontend will be served at `http://localhost:5173` and proxy API requests to the backend at `http://localhost:5000` by default.

## API Token & Security

The production server requires a token for all `/api/*` requests. In development the token is optional and the server will log a warning when it is missing.

### Environment variables

Create `server/.env`:

```
API_TOKEN=your-secret-token
PROD_ORIGIN=http://localhost:5173
```

Create `client/.env.production` used during `npm run build`:

```
VITE_API_URL=https://your-backend.example.com
```

### How to issue tokens

The backend checks a single static token defined in `API_TOKEN`. Distribute this token out-of-band to trusted users. The client stores it in `localStorage` under `api_token` and sends it as an `x-api-token` header. The UI prompts for the token if a request is unauthorized.

### How to run in dev vs prod

- **Development**: run `npm start` in `server` and `client`. No token or obfuscation is required.
- **Production**: set `NODE_ENV=production` on the server and ensure `API_TOKEN` and `PROD_ORIGIN` are configured. Build the client with `npm run build` and serve `client/dist`. Requests without a valid token receive `401` and the frontend will ask for a token.

### Security caveats

- The token is a simple bearer token stored in `localStorage`.
- Client-side obfuscation and key blocking are deterrents only and do not provide strong security.
- Always keep sensitive calculations on the server.
