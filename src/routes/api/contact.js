var Router = require("express").Router;
var Response = require("express").Response;
var check = require("express-validator/check").check;
var validationResult = require("express-validator/check").validationResult;
var HttpStatusCodes = require( "http-status-codes");

var auth = require("../../middleware/auth");

var Contact = require("../../models/Contact");


const router = Router();

// @route   POST api/contact
// @desc    Create user's contact
// @access  Private
router.post(
  "/",
  [auth, check("firstName", "First Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const {
      firstName,
      middleName,
      lastName,
      address,
      avatar,
      email,
      phone,
      company,
      jobTitle,
    } = req.body;

    // Build contact object based on IContact
    const contactFields = {
      user: req.userId,
      firstName,
      middleName,
      lastName,
      address,
      email,
      avatar,
      phone,
      company,
      jobTitle,
    };

    try {
      // Create
      const contact = new Contact(contactFields);

      await contact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);


// @route   GET api/contact
// @desc    Get all user contacts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // fetch all contacts of current user
    const contacts = await Contact.find({ user: req.userId }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/contacts/:contactId
// @desc    Get contact by contactId
// @access  Private
router.get("/:contactId", auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.contactId,
      user: req.userId,
    });

    if (!contact)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Contact not found" });

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Contact not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   PUT api/contacts/:contactId
// @desc    Update contact by contactId
// @access  Private
router.put("/:contactId", auth, async (req, res) => {
  try {
    // update contact and labels
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, user: req.userId },
      { $set: req.body },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Contact not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   DELETE api/contacts/:contactId
// @desc    Delete contact
// @access  Private
router.delete("/:contactId", auth, async (req, res) => {
  try {
    // Remove contact
    await Contact.findOneAndRemove({
      _id: req.params.contactId,
      user: req.userId,
    });

    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


module.exports = router;