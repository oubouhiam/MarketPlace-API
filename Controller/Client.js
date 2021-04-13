//__________________CALL MODEL____________________
const Client = require('../Models/Client.models');

const Product = require('../Models/Product.models');

const category = require('../Models/categories.models');

const Payment = require('../Models/Payment.models');
//Call Packages JSON Web Token & BCRYPT
const jwt = require('jsonwebtoken');
//A library to help you hash passwords.
const bcrypt = require('bcrypt');
// _____________PACKAGES NODEMAILER___________
const nodemailer = require("nodemailer");

const jwt_decode = require('jwt-decode');

const date = new Date();

//______________________get all Product_____________________ 
exports.ProductList = (req, res) => {
    Product.find()
    .then(ClientInfos => {
          res.status(200).json(ClientInfos);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
};

//______________________get all Categories_____________________ 
exports.GETCATEGORIES = (req, res) => {
    category.find()
      .then(categoryInfos => {
        res.status(200).json(categoryInfos);
      }).catch(error => {
        console.log(error);
        res.status(500).json({
          message: "Error!",
          error: error
        });
      });
  };

  //______________________get Product By Category_____________________ 
exports.getProductById = (req, res) => {
    Product.find({
        category: req.params.category
      })
      .then(Product => {
        res.send(Product);
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving question."
        });
      });
  };

//______________________Sort by Price Products_____________________ 
exports.Price = (req, res) => {
    Product.find()
    .sort({ price: -1 }).then(ClientInfos => {
        res.status(200).json(ClientInfos);
      }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}

//______________________Sort by Price Products_____________________ 
exports.Brand = (req, res) => {
    Product.find()
    .sort({ Titel: 1 }).then(ClientInfos => {
        res.status(200).json(ClientInfos);
      }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}

// ______________________get Product by id__________________
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
                message: "Error retrieving Product with id " + req.params.id,
                error: err
            });
        });
  };

//-------------------------Add Delivery-----------------------------

exports.PaymentAdd = (req, res) => {
    const payment = new Payment({
      fullname: req.body.fullname,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
        idProduct: req.body.idProduct,
        idSeller: req.body.idSeller,
        idUser : req.body.idUser,
        cardNumber : req.body.cardNumber,
        expareddate : req.body.expareddate,
        cvv : req.body.cvv,
        status : 'Unconfirmed',
        OrderDate : date
    });
    //Save
    payment.save()
    .then(() => res.json("Payment Makeded successfully"))
    .catch((err) => res.status(400).json("Error :" + err));
  };


//------------------------Client authentication---------------------
exports.ClientAuth = async (req, res) => {
    //10==saltRounds
    bcrypt.hash(req.body.Password, 10, function (err, hashPassword) {
        if (err) {
            res.json({
                error: err
            })
        }
        const FirstName = req.body.FirstName;
        const LastName = req.body.LastName;
        const Email = req.body.Email;
        const login = req.body.login;
        const role = "Client";
        const status = "Unvalide";
        const Verified = false;
        const Password = hashPassword;
        const ClientPush = new Client({
            FirstName,
            LastName,
            Email,
            login,
            role,
            status,
            Password,
            Verified
        });
        ClientPush
        
            .save()
            .then(() => res.json("Client ADDED!!!!!"))
            .catch((err) => res.status(400).json("Error :" + err));
    });
    
    const token = jwt.sign({login: req.body.login, Email : req.body.Email}, 'tokenkey');

    const transport = nodemailer.createTransport({
      service: "gmail",
          auth: {
              user: 'cyassin95@gmail.com',//email
              pass: 'Sanasaida123'//password
          }
      })
    
      await transport.sendMail({
          from: 'Cyassin95@gmail.com',
          to: req.body.Email,
          subject: "Email verification",
          html: `
          <h2>Please click on below link to activate your account</h2>
          <p>http://localhost:3000/validateAccount/${token}</p>
      `
      })
    // ----------------------send email validation -------------------------------
    
}

//------------------------Client authentication---------------------
exports.ClientActivated =  async(req, res) => {
  const token = req.params.token;

  jwt.verify(token, 'tokenkey');

  let decoded = await jwt_decode(token);
  let login = decoded.login;

   await Client.findOneAndUpdate({ login: login },{Verified : true});

   res.json({
           message : "ok"
   });
}

//-------------------------login Client-----------------------------
exports.ClientLog = (req, res) => {


    let login = req.body.login;
    let Password = req.body.Password;
  
    Client.findOne({
        login: login
      })
      .then(Client => {
  
        if (Client) {
          bcrypt.compare(Password, Client.Password, function (err, result) {
            if (err) {
              res.json({
                error: err
              })
            }
            if (result) {

              if(Client.Verified == false){
                res.json({
                  Verified: 'InActive'
                  })
            }if(Client.role != "Client"){
              res.json({
                role: Client.role
                })
          }else{

            let token = jwt.sign({
                login: login
              }, 'tokenkey', (err, token) => {
                res.cookie("token", token),
                // res.cookie("role", role)
                res.json({
                  token: token,
                  role: Client.role
                })
              })
            }



            } 
            
          })
        } else {
          res.json({
            message: 'client not found'
          })
        }
      }).catch((err) => res.status(400).json("Error :" + err));
  }
  
  //______________________get all Orders_____________________ 
exports.getOrder = (req, res) => {
  Payment.find()
    .then(PaymentInfos => {
      res.status(200).json(PaymentInfos);
    }).catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error
      });
    });
};

// ______________________get Order by id__________________
exports.getOrdersById = (req, res) => {
  Payment.findById(req.params.id)
      .then(Payment => {
        res.status(200).json(Payment);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Payment not found with id " + req.params.id,
                  error: err
              });                
          }
          return res.status(500).send({
              message: "Error retrieving Payment with id " + req.params.id,
              error: err
          });
      });
};

//______________________Delete Order_____________________ 
exports.DeleteOrders = (req, res) => {
  const {id} = req.params;
  Payment.findOneAndDelete({_id: id})
      .then(Payment => {
          if(!Payment) {
            res.status(404).json({
              message: "Does Not exist a Payment with id = ",
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a Payment with id = ",
            error: err.message
          });
      });
};

//________________________updating Order____________________
exports.UpdateOrders = (req, res) => {
  // Find Product By ID and update it
  Payment.updateOne({
      _id: req.params.id
    }, {
      status: req.body.status
    })
    .then(() => res.status(201).json("Order Confirmed successfully"))
    .catch((err) => res.status(400).json("Error :" + err));
};

// _____________SEND MAIL___________
exports.Email = async (req, res) => {
  const transport = nodemailer.createTransport({
  service: "gmail",
      auth: {
          user: 'cyassin95@gmail.com',//email
          pass: 'Sanasaida123'//password
      }
  })

  await transport.sendMail({
      from: 'flasn@gmail.Com',
      to: req.body.email,
      subject: "Bought Product",
      html: `<div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px; 
      ">
      <h2>Your Product Bought</h2>
      <p>Thanks for buying our Product<p>
  
       </div>
  `
  })
}


exports.clientLogout = (req, res) => {
  const deconnect = res.clearCookie('token')

  res.json({
      message: 'Client is Signout !!'
  })
}

