const users = require('../../MODEL/userModel')
const bcrypt = require('bcrypt')
const categorySchema = require('../../MODEL/categoryModel')
let msg = ''
let logMsg = ''

// run()
// async function run() {
//     try {
//         const user1 = await users.create({ name: 'weare', age: 'hey', hobbies: ['hy', 'where'], address: { street: 'helo' } })
//         console.log(user1)
//     } catch (error) {
//         console.log(error.message);
//     }
// }


module.exports = {
    homePage:async (req, res) => {
        const category = await categorySchema.find({}).lean()
        if (req.session.userId) {
            res.render('user/userHome', { user: true, userLogin: true ,userHome:true,category})
        } else {
            res.render('user/userHome', { user: true ,userHome:true ,  category })
        }
    },
    loginPage: (req, res) => {
        if (req.session.userId) {
            res.redirect('/')
        } else {
            res.render('user/login', { user: true, logMsg })
            logMsg = ''
        }
    },
    postLoginPage: async (req, res) => {
        let userDetails = req.body
        try {
            const user = await users.findOne({ email: userDetails.email })
            if (user) {
                let status = await bcrypt.compare(userDetails.password, user.password)
                if (status) {
                    req.session.userId = user._id
                    req.session.email = user.email
                    console.log('login success');
                    res.redirect('/')
                }
                else {
                    console.log('password incorrect');
                    logMsg = 'invalid username or password'
                    res.redirect('/login')
                }
            } else {
                logMsg = 'invalid username or password'
                res.redirect('/login')
            }


        } catch (error) {
            console.log(error.message)
        }
    },
    getSignupPage: (req, res) => {
        res.render('user/signup', { user: true, msg })
        msg = ''
    },
    postSignupPage: async (req, res) => {
        let userDetails = req.body
        userDetails.password = await bcrypt.hash(userDetails.password, 10)
        try {
            const user = await users.create({ name: userDetails.name, email: userDetails.email, password: userDetails.password })
            res.redirect('/login')
        } catch (error) {
            console.log(error.message)
            msg = 'email already exist'
            res.redirect('/signup')
        }
    },
    logout: async (req, res) => {
        req.session.destroy((error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('logout successfully');
                res.redirect('/');
            }
        })
    }
}