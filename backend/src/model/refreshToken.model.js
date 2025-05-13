import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    token : {
        type : String,
        required : true
    },
    expiresAt : {
        type : Date,
        default : Date.now,
        index : {expires : '7d'}
    }
});

const RefreshToken = mongoose.model('RefreshToken' , refreshTokenSchema);

export default RefreshToken;