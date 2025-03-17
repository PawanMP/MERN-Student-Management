import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // default value
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
