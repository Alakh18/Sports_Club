const express=require('express');
const app=express();
const cors = require('cors');
const port=5000;

app.use(cors());
app.get('/api/message',(req,res)=>{
    res.send("Hello Index page");
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});