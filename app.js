var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
//variable globale
global.loggedIn = null;
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newPostController = require('./controllers/newPost');
const validateMiddleWare = require('./middleware/validationMiddleware');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const logoutController = require('./controllers/logout');
const flash = require('connect-flash');


// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/newBlog", {});

const BlogPost = require('./models/BlogPost.js');
/*
BlogPost.create({
  title: 'Mon titre',
  body: 'Mon contenu de blog'
})
  .then(blogpost => {
    console.log(blogpost);
  })
  .catch(error => {
    console.error(error);
  });
*/

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use('/', indexRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use('/posts/store', validateMiddleWare);
app.use(expressSession({
  //définition du sel
  secret: 'nodejs est top'
}));
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId
  next()
});
app.use(flash());

app.get('/index', homeController);
app.get('/posts/new', newPostController);
app.get('/auth/register', newUserController);
app.get('/post/:id', getPostController);
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, storePostController, redirectIfAuthenticatedMiddleware);
app.post('/users/register', storeUserController);
app.get('/auth/login', loginController, redirectIfAuthenticatedMiddleware);
app.post('/users/login', loginUserController);
app.get('/auth/register', newUserController, redirectIfAuthenticatedMiddleware);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);
app.get('/auth/logout', logoutController);
app.use((req, res) => {
  res.render('notfound')
})

app.get('/index', async (req, res) => {
  const blogposts = await BlogPost.find({});
  console.log(blogposts);
  res.render('index', {
    blogposts
  })
});

app.get('/post/:id', async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post', { blogpost })
});

/*app.post('/posts/store', async (req, res) => {
  try {
    let image = req.files.image;
    await image.mv(path.resolve(__dirname, 'public/images', image.name));
    await BlogPost.create({
      ...req.body,
      image: '/images/' + image.name
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).send('Oops! Something went wrong.');
  }
});*/

// requests handlers qui appeleront nos controllers
app.get('/', (req, res) => {
  res.redirect('/index');
});


// 404 error handling
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handling
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;