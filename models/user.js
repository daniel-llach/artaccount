/**
 * Simple User module
 *
 * Contains a Mongoose schema / class definition for a user, a password implementation
 *
 * CREDITS
 * -------
 * Most of this code was taken from the excellent http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('./../config');

var UserSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    plan: { type: String, required: false}
}, { collection : 'users' });

UserSchema.pre('save', function(next) {
    console.log("start save");
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    console.log("before bcrypt");
    // generate a salt
    bcrypt.genSalt(config.salt, function(err, salt) {
        console.log("after bcrypt");

        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.statics.findByUsername = function (username, cb) {
  this.findOne({ username: username }, cb);
}

module.exports = mongoose.model('User', UserSchema)
