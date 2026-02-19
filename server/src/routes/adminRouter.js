const express = require("express")
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminAuth")
const adminRouter = express.Router()
const {createCountry, signAdmin, loginAdmin, updateCountry, deleteCountry, editCountry, getAdminProfile, getCountry, createUser, deleteUser} = require("../controllers/adminController")



// adminRouter.use(authMiddleware);
// adminRouter.use(adminMiddleware);

adminRouter.post("/signup", signAdmin)
adminRouter.post("/login", loginAdmin)
adminRouter.get("/me", authMiddleware, adminMiddleware, getAdminProfile)
adminRouter.get("/getcountries", getCountry)
adminRouter.post("/createcountry", authMiddleware, adminMiddleware, createCountry);
adminRouter.put("/updatecountry/:id", authMiddleware, adminMiddleware, updateCountry);
adminRouter.delete("/deletecountry/:id", authMiddleware, adminMiddleware, deleteCountry);
adminRouter.put("/editcountry/:id", authMiddleware, adminMiddleware, editCountry);
adminRouter.post("/createuser", authMiddleware, adminMiddleware, createUser);
adminRouter.delete("/deleteuser/:id", authMiddleware, adminMiddleware, deleteUser);


module.exports = adminRouter