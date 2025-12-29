import express from 'express'
import prisma from './lib/prisma';
import { createUser, getAllUsers } from './services/user.service';
import { GoAuth } from "./middleware/goAuth";

const app = express();

const PORT = process.env.PORT || 3002;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

app.use(express.json());
app.use("/auth", GoAuth);

app.get('/', (_,res)=>{
    res.status(400).send('Hellow There!! #2')
})

// AUTH ROUTES 
app.post("/login", async (req, res) => {
  const { email } = req.body;

  const response = await fetch(
    `${process.env.AUTH_SERVICE_URL}/token`, 
    {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userId: "123",
      email,
    }),
  });

  const data = await response.json();
  res.json(data);
});

app.get("/auth/profile", (_req, res) => {
  res.json({ message: "You are authenticated" });
});

app.get("/auth/admin", (_req, res) => {
  res.json({ message: "Admin route" });
});


// USER ROUTES
app.post('/user/create', async (req,res)=>{
  try{
    const {email, password, name} = req.body;

    if (!email || !password || !name){
      res.status(400).json({message: "missing feilds"});
    }

    const user = await createUser({email,password,name});

    res.status(201).json({
      id:user.id,
      email:user.email,
      name: user.name
    });

  } catch(err){
    res.status(400).json({message: "error creating user"})
  }
})

app.get('/user/all',async (_,res)=>{
  const user = await getAllUsers();
  res.json(user);
})


// SERVER LOGIC
const server =app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown(){
    console.log("Shutting down server...");
    server.close(async ()=>{
        try{
            await prisma?.$disconnect();
            console.log("Server closed.");
            process.exit(0);
        } catch (err){
            console.log(`Error Durign Shutdown:`, err)
        }
    })
}