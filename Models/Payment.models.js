const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Payment = new Schema({
        idProduct: {
            type: String,
            required: true,
            trim: true,
        },
        idSeller: {
            type: String,
            required: true,
            trim: true,
        },
        idUser: {
            type: String,
            required: true,
            trim: true,
        },
        cardNumber: {
            type: String,
            required: true,
            trim: true,
        },
        expareddate: {
            type: String,
            required: true,
            trim: true,
        },
        cvv: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            trim: true,
        },
        OrderDate : {
            type : String,
            required : true,
            trim : true,
        },
        fullname : {
            type : String,
            required : true,
            trim : true,
        },
        address : {
            type : String,
            required : true,
            trim : true,
        },
        phone : {
            type : String,
            required : true,
            trim : true,
        },
        email : {
            type : String,
            required : true,
            trim : true,
        }
    }

);

const PaymentList = mongoose.model("Payment", Payment);
module.exports = PaymentList;