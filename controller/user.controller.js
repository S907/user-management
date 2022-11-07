const jwt = require('jsonwebtoken');
const adminModel = require('../model/admin.model');
const userModel = require('../model/userModel.model');


class User{

    /**
     * @method: showUserPage
     * @desc: to show user blog page
     */
    async showIndexPage(req,res){
        try {
            res.render('users/user-page')
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

module.exports = new User()