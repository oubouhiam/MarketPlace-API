exports.checkout =  async(req, res) => {

  let error;
  let status;

  try {

    const  product = req.body.product;
    const token = req.body.token;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.titel}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";



    let orderDetails = { charge };
    let ShippingAddress = orderDetails.charge.source.address_line1
    let price = (orderDetails.charge.amount/100);
    let idProduct = product._id;
    let idSeller = product.id_seller;



  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });


}
