const express=require('express')
const app=express()
const render=require("render")
app.use(express.static("public"));
app.use(express.json())
const userController=require('./controller/user.controller')
const Product=require("./model/products.model")
const Cart=require("./model/cart.model")
app.use("/user",userController)
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // root directory for views views/



app.use("/products",(req,res)=>{
  return res.render("products")
})

app.post("/checkCart",async (req,res)=>{
 
  var item = await Cart.find({$and:[{userID:req.body.userID}, {productID:req.body.productID}]}).lean().exec();

  if(item.length == 0)
  {
    var insert = Cart.create(req.body);
    return res.json({status:"success", data:insert});
  }
  else{
    return res.json({status:"failed"})
  }
  
})


app.get("/productDetail/:id",async(req,res)=>{
  try{
    const data=await Product.findById(req.params.id).lean().exec();
    console.log(data)
    return res.render("productDetails",{data})
  }catch(err){
    return res.status(400).json(err.message)
  }
 
})
app.get("/data",async(req,res)=>{
  try{
    const data=await Product.find({}).lean().exec();
    // console.log(data)
    return res.json({res:data})
  }catch(err){
    return res.status(400).json(err.message)
  }
})



app.get("/loginpage",(req,res)=>{
return res.render("login")
})

app.get("/signuppage", (req,res)=>{
return res.render("signUp")
})

app.get("/index",async (req,res)=>{
return res.render("index")
})
const {register,login}=require('./controller/auth.controller');
app.post("/register",register)
app.post("/login",login)



module.exports=app;