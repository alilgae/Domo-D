const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');
const detailsPage = (req, res) => res.render('account');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) return res.status(400).json({ error: 'All fields required' });

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) return res.status(401).json({ error: 'Incorrect username or password' });

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const premium = `${req.body.premium}`;

  if (!username || !pass || !pass2) return res.status(400).json({ error: 'All fields required' });
  if (pass !== pass2) return res.status(400).json({ error: 'Passwords must match' });

  try {
    // encrypted password
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, paidAccount: premium });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);

    // duplicate entry
    if (err.code === 11000) return res.status(400).json({ error: 'Username already in use' });

    return res.status(500).json({ error: 'An error occurred' });
  }
};

const getAccountDetails = async (req, res) => {
  try {
    const account = { _id: req.session.account._id };
    const docs = await Account.find(account).select('username paidAccount').lean().exec();

    return res.json({ account: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

const upgradeAccount = async (req, res) => {
  const account = { _id: req.session.account._id };
  if (!account.paidAccount) {
    try {
      await Account.findOneAndUpdate(account, { $set: { paidAccount: true } }).exec();
      return res.status(201);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
  return res.status(500).json({ error: 'Error in upgrading account' });
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  getAccountDetails,
  upgradeAccount,
  detailsPage,
};
