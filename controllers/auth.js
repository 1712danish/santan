const { User } = require("../models/user");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
JWT_SECRET = "askfeed1234";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "santanrathore75209@gmail.com",
    pass: "*Saheb13*",
  },
});

const signup = async (req, res) => {
  const { username, password, email, phoneNo } = req.body;
  const userexist = await User.findOne({ email });
  if (!userexist) {
    const hashedPass = await bcryptjs.hashSync(password, 10);
    const token = jwt.sign({ username, email, }, JWT_SECRET, {
      expiresIn: "30m",
    });
    const newUser = {
      username,
      email,
      password: hashedPass,
      phoneNo,
      token,
    };

    const user = await User.create(newUser);
    if (user) {
      const data = {
        from: "no-reply@gmail.com",
        to: email,
        subject: "Account activation link",
        html: `<h2>PLease click on given link to activate your account</h2>
              <p>http://localhost:2000/api/activate/?token=${token}</p>
       `,
      };
      try {
        await transporter.sendMail(data);
        console.log("Email sent Successfully!");
      } catch (err) {
        console.log("error occured while sending email!", err);
      }
    }
    res.send(user);
  } else {
    res.send("User already exist!");
  }
};

const verifyAccount = async (req, res) => {
  try {
    const token = req.query.token;
    const decodedUser = jwt.verify(token, JWT_SECRET);
   
    const user = await User.findOne({ email: decodedUser.email, token: token });
    if (user) {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            isVarified: true,
            token: null,
          },
        }
      );

      res.send("user verified");
    } else {
      res.send(" Token expired or invalid Token");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { signup, verifyAccount };
