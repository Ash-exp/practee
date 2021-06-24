const router = require("express").Router();
const passport = require("passport");

// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");

// Users Registeration Route
router.get('/register-user', async (req, res) => {
  res.render('pages/create-account');
});
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "user", res);
});

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// Super Admin Registration Route
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});




router.post('/login', (req, res, next) => {
  passport.authenticate('local', 
    (err, user, info) => {
      if (info) { return res.redirect(303, '/login'); }
      if (err) { return next(err); }
      if (!user) { return res.redirect(303, '/login'); }
      req.login(user, (err) => {
          console.log("login");
          if (err) { return res.send(err) }
          next();
      })
    })(req, res, next);
  },
  function(req, res) {
    res.redirect(303,'/profile');
});

router.get('/authrequired', (req, res) => {
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.send('unauthorised\n');
  }
})


router.get('/logout', function (req, res) {
  req.logOut();
  res.status(200).clearCookie('connect.sid', {
    path: '/'
  });
  req.session.destroy(function (err) {
    res.redirect(303,'/login');
  });
});

// Users Login Route
router.get('/login', async (req, res) => {
  res.render('pages/login',{role : "user"});
});
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Admin Login Route
router.get('/login-admin', async (req, res) => {
  res.render('pages/login',{role : "admin"});
});
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

// Super Admin Login Route
router.get('/login-super-admin', async (req, res) => {
  res.render('pages/login',{role : "super-admin"});
});
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-and-admin-protectd",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);

module.exports = router;
