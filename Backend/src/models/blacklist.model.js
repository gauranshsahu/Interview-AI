const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required to be added in the blacklist"]
    }
},{
    timestamps:true
})

const tokenBlacklistModel = mongoose.model("blacklisttokens", blackListTokenSchema);

module.exports = tokenBlacklistModel;