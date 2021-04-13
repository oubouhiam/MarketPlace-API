//__________________CALL MODEL____________________
const Seller = require('../Models/Seller.models');
const Product = require('../Models/Product.models');
//Call Packages JSON Web Token & BCRYPT
const jwt=require('jsonwebtoken');
//A library to help you hash passwords.
const bcrypt=require('bcrypt');

const date = new Date();




//------------------------Seller authentication---------------------
exports.SellerADD = (req, res) => {
    //10==saltRounds
    bcrypt.hash(req.body.Password, 10, function (err, hashPassword) {
        if (err) {
            res.json({
                error: err
            })
        }
        const type = "Starter";
        const status = "InActive";
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email;
        const Username = req.body.Username;
        const docummant = req.body.docummant;
        const role = "Seller"
        // const docummant = {
        // data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        // contentType: 'image/png'};
        const Password = hashPassword;
        const SellerPush = new Seller({
            status,
            type,
            fname,
            lname,
            email,
            Username,
            docummant,
            Password,
            role
            
        });
        SellerPush
        
            .save()
            .then(() => res.json("Seller authentication successfully Please Wait untill Admin ACCEPTER Your documments"))
            .catch((err) => res.status(400).json("Error :" + err));
    });
}
//-------------------------login User-----------------------------

exports.SellerLogin = (req, res) => {

    let Username = req.body.Username;
    let Password = req.body.Password;

  Seller.findOne({
    Username: Username
    })
    .then(Seller => {

      if (Seller) {
        bcrypt.compare(Password, Seller.Password, function (err, result) {
          if (err) {
            res.json({
              error: err
            })
          }

          if (result) {

      // console.log(result.status);


            if(Seller.status == "InActive"){
                res.json({
                  status: 'InActive'
                  })
            }
            else if(Seller.status == "Block"){
              res.json({
                status: 'Block'
                })
          }
            
            
            
            else {
              let token = jwt.sign({
                Username: Username
              }, 'tokenkey', (err, token) => {
                res.cookie("token", token)
                res.json({
                  token: token
                })
              
            })
          }


        }
        
        
        
            
        else {
            res.json({
              message: 'password incorrect try again !!'
            })
          }
        })
      } else {
        res.json({
          message: 'Admin not found'
        })
      }
    }).catch((err) => res.status(400).json("Error :" + err));
}

//______________________get all Seller_____________________ 
exports.SellerList = (req, res) => {
    Seller.find()
    .then(SellerInfos => {
          res.status(200).json(SellerInfos);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
};

//______________________Add Product_____________________ 
exports.productAdd = (req,res) =>{
  const product = new Product({
    productImg: req.body.productImg,
    Titel: req.body.Titel,
    category: req.body.category,
    tags: req.body.tags,
    price: req.body.price,
    Qty: req.body.Qty,
    discription: req.body.discription,
    idSeller: req.body.idSeller,
    currentDate: date,
    status : req.body.status,
                    });
//Save
product.save()
.then(() => res.status(201).json("Product ADDED successfully"))
.catch((err) => res.status(400).json("Error :" + err));

};


//______________________Delete Product_____________________ 
exports.DeleteProduct = (req, res) => {
  const {id} = req.params;
  Product.findOneAndDelete({_id: id})
      .then(Product => {
          if(!Product) {
            res.status(404).json({
              message: "Does Not exist a Product with id = ",
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a Product with id = ",
            error: err.message
          });
      });
};

//________________________updating Product____________________
exports.UpdateProduct = (req, res) => {
  // Find Product By ID and update it
  Product.updateOne({
      _id: req.params.id
    }, {
      productImg: req.body.productImg,
      Titel: req.body.Titel,
      category: req.body.category,
      tags: req.body.tags,
      price: req.body.price,
      Qty: req.body.Qty,
      discription: req.body.discription,
      idSeller: req.body.idSeller,
      currentDate: date,
      status : req.body.status
    })
    .then(() => res.status(201).json("Product updated successfully"))
    .catch((err) => res.status(400).json("Error :" + err));
};

//______________________get all Product_____________________ 
exports.ProductList = (req, res) => {
  Product.find()
  .then(ProductInfos => {
        res.status(200).json(ProductInfos);
      }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
};

//________________________Get Product By id____________________
exports.getProductById = (req, res) => {
  Product.findById(req.params.id)
      .then(Product => {
        res.status(200).json(Product);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Product not found with id " + req.params.id,
                  error: err
              });                
          }
          return res.status(500).send({
              message: "Error retrieving Category with id " + req.params.id,
              error: err
          });
      });
};