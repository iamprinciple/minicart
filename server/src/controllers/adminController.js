const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const countryModel = require("../models/countryModel");


const signAdmin = async (req, res) => {
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
                role
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
const loginAdmin = async (req, res) => {
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
const getAdminProfile = async (req, res) => {
    return res.status(200).send({ status: true, user: req.user })

}

const getCountry = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};
        const allCountries = await countryModel.find(query).sort({ name: 1 }).skip(skip).limit(limit)
        const total = await countryModel.countDocuments(query);



        return res.status(200).send({
            success: true,
            message: "Countries retrieved successfully",
            count: allCountries.length,
            totalCountries: total,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: allCountries
        });
    } catch (error) {
        return res.status(500).send({ message: "server error", status: false })
    }
}
const createCountry = async (req, res) => {
    try {
        console.log(req.body);
        let { code, name, phoneCode, status } = req.body;
        if (!code || !name || !phoneCode) {
            return res.status(400).send({ status: false, message: "code, name, and phoneCode are required" })
        }
        code = code.trim().toUpperCase();
        name = name.trim();
        phoneCode = phoneCode.trim();
        const existingCountry = await countryModel.findOne({ $or: [{ code }, { name }] });
        if (existingCountry) {
            return res.status(400).send({ status: false, message: "country already exists" })

        }
        const country = await countryModel.create({
            code,
            name,
            phoneCode,
            status: status ?? true
        })


        return res.status(200).send({ message: "Country created successflly", status: true, data: country })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error, try again', status: false })

    }

}
const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const {
            firstname,
            lastname,
            email,
            password,
            phoneNumber,
            address,
            country = 'Nigeria',
            state,
            city,
            gender,
            birthday,
            accountStatus = 'Active',
            role = 'user',
        } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'First name, last name, email and password are required',
            });
        } 
        const userExists = await userModel.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(409).send({
                success: false,
                message: 'A user with this email already exists',
            });
        }
        const user = await userModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password,
            phoneNumber: phoneNumber?.trim(),
            address: address?.trim(),
            country: country.trim(),
            state: state?.trim(),
            city: city?.trim(),
            gender: gender || 'Prefer not to say',
            birthday,
            accountStatus,
            role,
        });
        res.status(201).send({
            success: true,
            message: 'User created successfully',
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                accountStatus: user.accountStatus,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.log(error);

    }
}
const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.send({ message: 'User deleted' });
    } catch (error) {
        return res.status(500).send({ message: 'Server error' });
    }
}
const updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, phoneCode, status } = req.body;

        const country = await countryModel.findById(id);

        if (!country) {
            return res.status(404).send({ success: false, message: "Country not found", });
        }

        country.code = code ?? country.code;
        country.name = name ?? country.name;
        country.phoneCode = phoneCode ?? country.phoneCode;
        country.status = typeof status === "boolean" ? status : country.status;

        await country.save();

        return res.status(200).send({ success: true, message: "Country updated successfully", data: country, });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Server error", });
    }
};
const deleteCountry = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await countryModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).send({ success: false, message: "Country not found" });
        }

        return res.status(200).send({ success: true, message: "Country deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Server error" });
    }
};

const editCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, phoneCode, status } = req.body;

        if (!code && !name && !phoneCode && status === undefined) {
            return res.status(400).send({ status: false, message: "At least one field must be provided for update" });
        }

        const existingCountry = await countryModel.findById(id);
        if (!existingCountry) {
            return res.status(404).send({
                status: false,
                message: "Country not found"
            });
        }

        if (code || name) {
            const duplicate = await countryModel.findOne({
                $or: [{ code }, { name }],
                _id: { $ne: id }
            });
            if (duplicate) {
                return res.status(400).send({
                    status: false,
                    message: "Another country with the same code or name already exists"
                });
            }
        }

        if (code) existingCountry.code = code.trim().toUpperCase();
        if (name) existingCountry.name = name.trim();
        if (phoneCode) existingCountry.phoneCode = phoneCode.trim();
        if (status !== undefined) existingCountry.status = status;

        await existingCountry.save();

        return res.status(200).send({
            status: true,
            message: "Country updated successfully",
            data: existingCountry
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: false,
            message: "Internal server error"
        });
    }
};



module.exports = { createCountry, signAdmin, loginAdmin, getAdminProfile, getCountry, updateCountry, deleteCountry, editCountry, createUser, deleteUser }