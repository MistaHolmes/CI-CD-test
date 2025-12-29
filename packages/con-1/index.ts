import express from 'express'

const app = express();
const admin = express();
const PORT = process.env.PORT || 3000;


app.get('/', (_,res)=>{
    res.type('json').send(JSON.stringify({Message:"Hellow There!!"}))
})

const server1 = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
const server2 = admin.listen(4002, ()=>{
    console.log('Hush Hush')
})

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown(){
    console.log("Shutting down server...");
    server1.close(()=>{
        try{
            console.log("Server closed.");
            process.exit(0);
        } catch (err){
            console.log(`Error Durign Shutdown:`, err)
        }
    })
    server2.close(()=>{
        process.exit(0)
    })

}
