const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})

//usando o bcrypt como modo de segurança para transformar o password 
//pre faz com que esse middleware rode antes de salvar
userSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, 10,
             (err, hashedPassword) => {
                 if(err) {
                     next(err);
                 }else {
                     this.password = hashedPassword;
                     next();
                 }
             }   
        )
    }
});

//metodo para comparar o password
userSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if(err){
            callback(err);
        }else{
            callback(err,same);
        }
    })
}

module.exports = mongoose.model('User', userSchema)