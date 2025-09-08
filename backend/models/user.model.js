import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        required : true
    },
    active: {
        type: Boolean,
        default: true,
	},
    approved : {
        type : Boolean,
        default : true
    },
    accountType : {
        type : String,
        enum : ["Admin", "Instructor", "Student"],
        required : true
    },
    additionalDetails : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Profile"
    },
    courses : [
        {
            type : Schema.Types.ObjectId,
            ref : "Course"
        }
    ],
    image : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String
    },
    token : {
        type : String
    },
    resetPasswordExpiresAt   : {
        type : Number
    },
    courseProgress : [
        {
            type : Schema.Types.ObjectId,
            ref : "CourseProgress"
        }
    ],
},
{timestamps : true})

//We have to encrypt password before saving it. Also if the password is modified in future , then again before saving in db we have to encrypt it.
userSchema.pre("save", async function (next) {
    
    if(!this.isModified("password")) return next(); //if the modified field is not password

    this.password = await bcrypt.hash(this.password,10);
    next();
})


userSchema.methods.isPasswordCorrect =  async function (password)  {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken =  function () {
    //short lived token
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            accountType : this.accountType
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken =  function () {
    //long lived token
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}


export const User = mongoose.model("User", userSchema)