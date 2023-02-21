import bcrypt from "bcrypt";
import User from "../models/User_model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try{
        const password = req.body.password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id
            }, 'secret123',

            {
                expiresIn: '30d'
            })

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: "Can't register"
        })
    }
}
export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})

        if(!user) {
            return res.status(404).json({
                message: "User can not be found"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass) {
            return res.status(400).json({
                message: "Email or password is not valid"
            })
        }

        const token = jwt.sign({
                _id: user._id
            }, 'secret123',

            {
                expiresIn: '30d'
            })

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't login"
        })
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if(!user){
            return res.status(404).json({
                message: "No user found"
            })
        }
        const {passwordHash, ...userData} = user._doc

        res.json({
            userData
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "No access"
        })
    }
}
