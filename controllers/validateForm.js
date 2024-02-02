const Yup = require("yup");

const schema = Yup.object({
  username: Yup.string()
    .required("Username required!")
    .min(6, "Username too short!")
    .max(28, "Username too long!"),
  password: Yup.string()
    .required("Password required!")
    .min(6, "Password too short!")
    .max(28, "Password too long!"),
});

const validateForm = (req, res) => {
  const formData = req.body;
  schema
    .validate(formData)
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        console.log("Valid!");
      }
    });
};




module.exports = validateForm;
