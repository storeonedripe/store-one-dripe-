const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;


// =====================
// Middleware
// =====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")));



// =====================
// Data JSON
// =====================

const dataFile = path.join(__dirname,"data.json");


if(!fs.existsSync(dataFile)){

    fs.writeFileSync(
        dataFile,
        JSON.stringify({
            products:[],
            commandes:[]
        },null,2)
    );

}



function loadData(){

    return JSON.parse(
        fs.readFileSync(dataFile,"utf8")
    );

}



function saveData(data){

    fs.writeFileSync(
        dataFile,
        JSON.stringify(data,null,2)
    );

}





// =====================
// Upload Images
// =====================


const uploadFolder = path.join(
    __dirname,
    "public",
    "uploads"
);



if(!fs.existsSync(uploadFolder)){

    fs.mkdirSync(uploadFolder,{
        recursive:true
    });

}



const storage = multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,uploadFolder);

    },


    filename:function(req,file,cb){

        cb(null,Date.now()+"-"+file.originalname);

    }

});



const upload = multer({
    storage:storage
});







// =====================
// Pages
// =====================


app.get("/",(req,res)=>{

    res.sendFile(
        path.join(__dirname,"public","index.html")
    );

});



app.get("/admin",(req,res)=>{

    res.sendFile(
        path.join(__dirname,"admin","admin.html")
    );

});






// =====================
// Ajouter Article
// =====================


app.post("/add-product",
upload.single("image"),
(req,res)=>{


    let data = loadData();



    let product={


        id:Date.now(),

        name:req.body.name,

        price:req.body.price,

        description:req.body.description,

        image:req.file
        ? "/uploads/"+req.file.filename
        : ""

    };



    data.products.push(product);


    saveData(data);



    res.redirect("/admin");


});







// =====================
// Afficher Articles
// =====================


app.get("/products",(req,res)=>{


    let data=loadData();


    res.json(data.products);


});








// =====================
// Supprimer Article
// =====================


app.delete("/delete-product/:id",(req,res)=>{


    let data=loadData();



    data.products =
    data.products.filter(
        p=>p.id != req.params.id
    );



    saveData(data);



    res.json({
        message:"Supprimé"
    });


});








// =====================
// Modifier Article
// =====================


app.put("/update-product/:id",(req,res)=>{


    let data=loadData();



    let product=data.products.find(
        p=>p.id == req.params.id
    );



    if(!product){

        return res.status(404).json({
            message:"Introuvable"
        });

    }



    product.name=req.body.name;

    product.price=req.body.price;

    product.description=req.body.description;



    saveData(data);



    res.json({
        message:"Modifié"
    });


});









// =====================
// COMMANDES CLIENTS
// =====================


// استقبال commande من client

app.post("/commande",(req,res)=>{


    let data=loadData();



    let commande={


        id:Date.now(),

        nom:req.body.nom,

        prenom:req.body.prenom,

        telephone:req.body.telephone,

        adresse:req.body.adresse,

        date:new Date()

    };



    data.commandes.push(commande);



    saveData(data);



    console.log("Nouvelle commande:",commande);



    res.json({

        message:"Commande envoyée à l'administration"

    });



});









// إرسال commandes للـ Admin


app.get("/commandes",(req,res)=>{


    let data=loadData();


    res.json(data.commandes);


});







// =====================
// Start
// =====================


app.listen(PORT,()=>{

    console.log(
        "Serveur démarré : http://localhost:"+PORT
    );

});