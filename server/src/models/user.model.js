import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be at most 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,

      // Deliberately loose. Real verification happens by sending an email,
      // not by writing a stricter regex.
      match: [/^\S+@\S+\.\S+$/, "Email format is invalid"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Exclude password from query results by default
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a supported role",
      },
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Only rehash when the password actually changed, otherwise every profile
// update would rehash an already-hashed value.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await argon2.hash(this.password);
});

userSchema.methods.verifyPassword = function verifyPassword(candidate) {
  return argon2.verify(this.password, candidate);
};

// Defense in depth: login queries explicitly select the password, and this
// keeps it from riding along into an API response.
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
