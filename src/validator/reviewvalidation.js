const { isValidRequestBody, isValidData, isValidObjectId } = require("../validator/validation")



const ratingCheck = function (value) {
   num = /^[1-5]{1}$/
   if (!num.test(value)) return false

   return true
}



const reviewCheck = function (req, res, next) {
   const requestBody = req.body
   bookId = req.params
   if (!isValidRequestBody(requestBody))
      return res.status(400).send({ status: false, message: "please give review and details" })


   const { reviewedBy, rating, review } = requestBody
   // =========check wheather mandatory  fields are present or not=======================//
   let missdata = ""
   if (!bookId) {
      missdata = missdata + "bookId"
   }

   if (!ratingCheck(rating)) {
      missdata = missdata + " " + "rating"
   }


   if (missdata) {
      let message = missdata + " " + "is missing or not in proper format"
      return res.status(400).send({ status: false, message: message })
   }
   if (reviewedBy) {
      if (!isValidData(reviewedBy))
         return res.status(400).send({ status: false, message: "give proper name as reviewdBy" })
   }

   if (!isValidObjectId(bookId.bookId)) {
      return res.status(400).send({ status: false, message: "not a valid bookId" })
   }

   next()
}





module.exports = { reviewCheck }