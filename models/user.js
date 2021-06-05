const mongoose = require("mongoose");
// const crypto = require ('crypto')


const userSchema = mongoose.Schema({

  username: {
    type: String,
    required:true,
    max:64,
  },
  password: {
    type: String,
    required:true,
  },
  email: {
    type: String,
    unique:true,
    lowercase: true,
  },
  phoneNo: {
    type: Number,
  },
  isVarified:{
    type: Boolean,
    default:false
  },
  token:{
    type: String
  }
});
const User = mongoose.model("User", userSchema);
module.exports = { User };
