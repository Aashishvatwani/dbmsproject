const express = require('express');
const app = express();
app.use("/",(req,res,next)=>{
    res.send("Hello World");
    next();
})

const port= 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});