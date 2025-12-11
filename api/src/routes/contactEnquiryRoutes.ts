// import express from "express";

// import {
//   addContactEnquiry,
//   getContactEnquiries,
//   softDeleteContactEnquiry,
// } from "../controllers/contactEnquiryController.js";

// import { roleFromUrl } from "../middlewares/roleUrlMiddleware.js";

// const router = express.Router();

// /* -------------------- PUBLIC ROUTES -------------------- */
// router.post("/contact-enquiries", addContactEnquiry); // Add a new enquiry

// /* -------------------- ADMIN MIDDLEWARE -------------------- */
// const adminMiddleware = roleFromUrl(["admin"]);

// /* -------------------- ADMIN ROUTES -------------------- */
// router.get("/contact-enquiries", getContactEnquiries); // List all enquiries

// router.delete(
//   "/:role/contact-enquiries/delete/:id",
//   adminMiddleware,
//   softDeleteContactEnquiry
// );

// export default router;


import express from "express";
import {
  addContactEnquiry,
  getContactEnquiries,
  softDeleteContactEnquiry,
} from "../controllers/contactEnquiryController.js";
import { roleFromUrl } from "../middlewares/roleUrlMiddleware.js";

const router = express.Router();

/* -------------------- PUBLIC ROUTES -------------------- */
router.post("/contact-enquiries", addContactEnquiry); // Add a new enquiry

/* -------------------- ADMIN ROUTES -------------------- */
const adminMiddleware = roleFromUrl(["admin"]);

/* -------------------- PROTECTED ADMIN ENDPOINTS -------------------- */
router.get("/contact-enquiries", getContactEnquiries);

router.delete(
  "/:role/contact-enquiries/delete/:id",
  ...adminMiddleware,
  softDeleteContactEnquiry
);

export default router;
