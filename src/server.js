import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
import path from "path"
import { fileURLToPath } from "url";
import { Login, Register } from "./controllers/auth.controller.js"
import { GetProfile, UpdateProfile } from "./controllers/profile.controller.js"
import { GetOneTodo, PostTodo, PutTodos, GetAllTodo } from "./controllers/todo.controller.js"
import { AuthMiddleware } from "./middleware/auth.middleware.js"
// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname);

const port = process.env.PORT || 5000

const app = express()

// rules
app.use(express.static('public'))  // make public anyone can access

// headers
app.use(express.json())
app.use(cors())




// api-routes
app.post('/api/auth/login', Login)
app.post('/api/auth/register', Register)

// profile 
app.get('/api/profile', AuthMiddleware, GetProfile)
app.put('/api/profile', AuthMiddleware, UpdateProfile)

// todos 
app.post('/api/:user_id/todos', AuthMiddleware, PostTodo)
app.put('/api/:user_id/todos/:id', AuthMiddleware, PutTodos)
app.get('/api/:user_id/todos/:id', AuthMiddleware, GetOneTodo)
app.get('/api/:user_id/todos', AuthMiddleware, GetAllTodo)








// web-routes (GET)
app.get("/", (req, res) => res.sendFile(path.join(rootPath, "html", "index.html")))






// server listens
app.listen(port, () => {
    console.log("server running: http://127.0.0.1:" + port)
})


