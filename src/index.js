const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

dotenv.config();
app.use(express.json())

const PORT = process.env.PORT;

app.get("/api" , (req,res) => {
    res.send("Hello World")
});


// http method get
app.get('/products', async (req,res) => {
    const product = await prisma.produuct.findMany()

    res.send(product)
})

app.get('/products/:id', async (req,res) => {
    const productId = req.params.id 

    const product = await prisma.produuct.findUnique({
        where: {
            id: parseInt(productId)
        }
    });

    if(!product){
        res.send("product not found")
    }

    res.send(product)
})

// http method post
app.post('/products', async (req, res) => {
    const newProduct = req.body;

    const product = await prisma.produuct.create({
      data: {
        name : newProduct.name,
        description : newProduct.description,
        price : newProduct.price,
        image : newProduct.image,
      }  
    })

    res.status(201).send({
        data: product,
        message: "create successfully"
    })
})

// http method delete
app.delete("/products/:id", async (req,res) => {
    const productId = req.params.id

    await prisma.produuct.delete({
        where: {
            id: parseInt(productId),
        }
    })

    res.send("product deleted ")
})

//http method put
app.put("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;
    
    if(!(productData.name && productData.description && productData.price && productData.image)) {
        return res.status(400).send("data yang dimasukan tidak lengkap")
    }
    const product = await prisma.produuct.update({
        where: {
            id: parseInt(productId)
        },
        data: {
            name : productData.name,
            description : productData.description,
            price : productData.price,
            image : productData.image,
        }
    })

    res.send({
        data: product,
        massage: "edit product successfully"
    })
})

//http method patch
app.patch("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;

    const product = await prisma.produuct.update({
        where: {
            id: parseInt(productId)
        },
        data: {
            name : productData.name,
            description : productData.description,
            price : productData.price,
            image : productData.image,
        } 
    })
    res.send({
        data: product,
        massage: "Edit successfully"})
})

app.listen(PORT, () => {
    console.log("Run in " + PORT)
})