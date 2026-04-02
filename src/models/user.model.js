const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required for creating a user"],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
    unique: [true, "email already exist"]
  },

  name: {
    type: String,
    required: [true, "name is required"]
  },

  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password should contain more then 6 character"],
    select: false
  },
   
  systemuser:{
    type:Boolean,
    default:false,
    immutable:true,
    select:false
  }

}, { timestamps: true });   


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});


// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;