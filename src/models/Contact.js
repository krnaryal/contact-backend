//import { Document, Model, model, Schema } from "mongoose";
var Document = require("mongoose").Document;
var Model = require("mongoose").Model;
var model = require("mongoose").model;
var Schema = require("mongoose").Schema;

const phoneSchema = new Schema({
  contact: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
  },
  countryCode: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
    default: "mobile",
  },
  number: {
    type: String,
    required: false,
  },
});


const contactSchema = new Schema({
  email: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  jobTitle: {
    type: String,
    required: false,
  },
  isFavorite: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone: {
    type: String,
    required: false,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Phone= model("Phone", phoneSchema);
const Contact = model("Contact", contactSchema);

module.exports = Contact;
