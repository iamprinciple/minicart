const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const signUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).send({ message: "Email already registered", status: false })
        }
        if (!firstname || !lastname || !password || !role || !email) {
            return res.status(400).send({ message: "All fields are mandatory", status: false })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await userModel.create({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: 'user',
                phoneNumber,
                address,
                country,
                state,
                city,
                gender,
                birthday: birthday? new Date(birthday) : null,
                accountStatus: accountStatus || 'Active'
            })
            if (!user) {
                res.status(402).send({ message: "error creating user", status: false })
            } else {
                return res.status(200).send({ message: "Sign up success", status: true })
            }
        }

    } catch (error) {
        return res.status(500).send({ message: 'Network error, please try again', status: false })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ message: "All fields are mandatory", status: false })
        }
        const existingUser = await userModel.findOne({ email: email })
        if (!existingUser) {
            res.status(400).send({ message: "You are not a registered user", status: false })
        } else {
            const correctPassword = await bcrypt.compare(password, existingUser.password)

            if (!correctPassword) {
                res.status(402).send({ message: "Incorrect password", status: false })
            } else {
                const token = jwt.sign({ email, role: existingUser.role, firstname: existingUser.firstname, lastname: existingUser.lastname }, process.env.JWT_SECRET, { expiresIn: "1day" })
                // console.log(token);

                return res.status(200).send({ message: "Login success", status: true, token, existingUser })
            }
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal server error, try again', status: false })
    }

}
const getUserprofile = async (req, res) => {
    return res.status(200).send({ status: true, user: req.user })

}
const getUser = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10, status } = req.query;
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.accountStatus = status;
        const allUsers = await userModel.find(query).select('-password').sort({ name: 1 }).skip(skip).limit(Number(limit))
        const total = await userModel.countDocuments(query);
        

        return res.status(200).send({
            success: true,
            message: "Countries retrieved successfully",
            count: allUsers.length,
            totalUser: total,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: allUsers
        });
    } catch (error) {
        return res.status(500).send({ message: "server error", status: false })
    }
}


module.exports = {signUser, loginUser, getUserprofile, getUser}