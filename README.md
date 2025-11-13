### clone the repo

clone the repo using

```bash
git clone https://github.com/sarthak-gc/palmmind_task.git
```

### set up the backend

head into backend directory

```bash
cd backend
```

install dependencies using `yarn`, `npm`, or any package manager of your choice

```bash
yarn
# or
npm i
```

copy `.env.example` to `.env`

```bash
cp .env.example .env
```

update the `.env` file with valid values, you can leave `port` and `jwt_secret` as they are, you should change `mongo_uri` to a valid mongodb uri.

Example :

```bash
MONGO_URI=mongodb://mongo:password@localhost:27017/dbname?authSource=admin
```

compile typescript files

```bash
yarn tsc -b
```

run the backend:

```bash
node dist/index.js
```

if setup was done correctly, you should see the server is running on the port specified in your `.env` file (`4321 by default`) and a `db connected` message.

---

### set up the frontend

head into the `frontend` directory:

```bash
cd ../frontend  # if you're in the backend folder
# or
cd frontend  # if you're in the root folder
```

install dependencies using `yarn`, `npm`, or any package manager of your choice

```bash
yarn
# or
npm i
```

copy `.env.example` to `.env`

```bash
cp .env.example .env
```

in the `.env` file, replace the `vite_socket_url` with your backend url, including the correct port:

```bash
VITE_SOCKET_URL=http://localhost:your_backend_port_here # eg: VITE_SOCKET_URL=http://localhost:4321 by default
```

start the frontend:

```bash
yarn run dev
# or
npm run dev
```

if everything is set up correctly, the frontend should be available on `http://localhost:5173`
if your 5173 port was occupied, it will automatically try the next available port such as 5174, you can check the terminal output for the specific port, after running `yarn run dev` or `npm run dev`
