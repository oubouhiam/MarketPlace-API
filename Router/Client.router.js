module.exports = function (app) {

	const cors = require("cors")

    // --------------------Calling Controller File----------------- 
    var Client = require('../Controller/Client');
    // --------------------Calling Controller File----------------- 

    //------------------------get all Product---------------------
    app.get('/products', Client.ProductList);


    //------------------------get all Product---------------------
    app.get('/prdct', Client.ProductList);
    


    
    //------------------------get all Catigories---------------------
    app.get('/category', Client.GETCATEGORIES);

    // ______________________get Product by id__________________
    app.get('/products/:category', Client.getProductById);

    // ______________________get Product by Sort__________________
    app.get('/Price', Client.Price);
        // ______________________get Product by Sort__________________
    app.get('/Name', Client.Brand);

    // ______________________get Product by id__________________
    app.get('/product/:id', Client.getProductById);

    // ______________________MakePayment__________________
    app.post('/Home/Checkout/Payment', Client.PaymentAdd);

    // ______________________MakePayment__________________
    app.post('/Home/SignUp', Client.ClientAuth);
    //-------------------------login Client-----------------------------
    app.post('/Home/SignIn', Client.ClientLog);


    app.put('/activateAccount/:token', Client.ClientActivated);


         // ______________________get Product by id__________________




        //-------------------------Get All Order-----------------------------
   app.get('/order', Client.getOrder);

    // ______________________get order by id__________________
    app.get('/order/:id', Client.getOrdersById);

   
        //-------------------------Delete Product-----------------------------
        app.delete('/order/delete/:id', Client.DeleteOrders);

        //-------------------------Order Update-----------------------------
        app.put('/order/update/:id', Client.UpdateOrders);
    
         // ______________________get Product by id__________________
	app.post('/send_mail', cors(),Client.Email);

        //-------------------------Logout superAdmin-----------------------------
        app.get('/log/Logout', Client.clientLogout);


}