const bookModel = require("../models/booksModel");
const userModel = require("../models/userModel");
const { isValidRequestBody, isValidData, isValidObjectId } = require("../validator/validation")
const validator = require('validator')
const moment = require('moment')

const bookvalidation = async function (req, res, next) {
    try {
        let data = req.body;

        //validating empty body
        if (!isValidRequestBody(data))
            return res.status(400).send({ status: false, msg: "Body cannot be empty" })

        const {title, excerpt, userId, ISBN, category, subcategory, releasedAt} = data

        //validating title is entered and valid
        if (!isValidData(title))
            return res.status(400).send({ status: false, msg: `${title} is not a valid title` })
        if (!/^([a-zA-Z ]+)$/.test(title.trim())) {
            return res.status(400).send({ status: false, msg: " enter valid title in alphabets only " });
        }
        let bookTitle = await bookModel.findOne({ title: title })
        if (bookTitle) return res.status(400).send({ status: false, msg: "Book with this title is already" })

        //validating excerpt is entered and valid
        if (!isValidData(excerpt))
            return res.status(400).send({ status: false, msg: `${excerpt} is not a valid excerpt` })
        if (!/^([a-zA-Z\S ]+)$/.test(excerpt.trim())) {
            return res.status(400).send({ status: false, msg: "enter valid excerpt in alphabets only" });
        }

        //validating userId is entered and valid
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, msg: `${data.userId} is not a valid Object ID` })

        let user_id = await userModel.findById({ _id: data.userId });
        if (!user_id) {
            return res.status(400).send({ status: false, msg: "No such User  exsit" });
        }

        //validating ISBN is entere and valid
        if (!validator.isISBN(data.ISBN))
            return res.status(400).send({ status: false, msg: `${data.ISBN} is not a valid ISBN` })

        let checkISBN = await bookModel.find({ ISBN: data.ISBN });
        if (checkISBN.length !== 0) {
            return res.status(400).send({ status: false, msg: "plz enter new ISBN" });
        }


        //Validating category is entered and valid

        if (!isValidData(data.category))
            return res.status(400).send({ status: false, msg: `${data.category} is not a valid category` })
        if (!/^([a-zA-Z ]+)$/.test(data.category.trim())) {
            return res.status(400).send({ status: false, msg: " enter valid category in alphabets only" });
        }

    //validating subCategory is entered and valid
    if (typeof data.subcategory === "undefined" || data.subcategory === null)
        return res.status(400).send({ status: false, msg: `${data.subcategory} is not a valid subcategory` })
    if (data.subcategory.length == 0) {
        return res.status(400).send({ status: false, msg: "subcategory is not valid" });
    }


        if (data.subcategory) {
            for (let i = 0; i < data.subcategory.length; i++) {
                if (data.subcategory[i] == 0) {
                    return res.status(400).send({ status: false, msg: "subcategory should have atleast one alpha" });
                }

                if (!/^([a-zA-Z ]+)$/.test(data.subcategory[i])) {
                    return res.status(400).send({ status: false, msg: " enter valid subcategory in alphabets only" });
                }
            }
        }


        if (!data.releasedAt) {
            return res.status(400).send({ status: false, msg: "releasedAt is not given" })
        }


        if (data.releasedAt !== "^\\d{4}-\\d{2}-\\d{2}$") {
            if (data.releasedAt !== moment().format("YYYY-MM-DD")) {
                return res.status(400).send({ status: false, msg: "date format should be in YYYY-MM-DD" })


            }
            next()
        }
    } catch (err) {
        res.status(500).send({ status: false, massage: "success", msg: err.message });
    }
}

module.exports = bookvalidation
