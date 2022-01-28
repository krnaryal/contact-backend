//import { Document, Model, model, Schema } from "mongoose";
var Document = require("mongoose").Document;
var Model = require("mongoose").Model;
var model = require("mongoose").model;
var Schema = require("mongoose").Schema;




const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      required: false,
      default: () => ({}),
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});


const User = model("User", userSchema);


module.exports = User;
