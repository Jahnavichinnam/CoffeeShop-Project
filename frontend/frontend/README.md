# Coffee Shop Frontend

React + Vite + Bootstrap frontend for the Coffee Shop Spring Boot API.

## Run in VS Code

1. Extract the ZIP.
2. Open the `frontend` folder in VS Code.
3. Open the VS Code terminal in that folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL shown by Vite (usually `http://localhost:5173`).

The backend should be running at `http://localhost:8080`. The frontend calls:
- `GET /coffeeshop/displayall`
- `POST /coffeeshop/add`
- `PUT /coffeeshop/update/{id}`
- `DELETE /coffeeshop/delete/{id}`

The frontend expects the backend response fields `id`, `shopName`, `location`, `averagePrice`, and `open`.

## Docker

Build the frontend image from this directory:

```bash
docker build -t coffee-shop-frontend .
```

Run it:

```bash
docker run --rm -p 3000:80 coffee-shop-frontend
```

Then open `http://localhost:3000`.

### Backend URL when using Docker

Vite embeds `VITE_API_BASE_URL` at build time. When building the frontend image, pass the browser-accessible backend URL, for example:

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:8080/coffeeshop -t coffee-shop-frontend .
```

If the frontend is opened from another computer, replace `localhost` with the host computer's reachable IP/domain. Do not use a Compose-only service name in this browser URL.
