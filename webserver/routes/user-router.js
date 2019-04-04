'use strict';

const express = require('express');
// const multer = require('multer');

const getUserProfile = require('../controllers/user/get-user-profile');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const updateUserProfile = require('../controllers/user/update-user-profile');
// const uploadAvatar = require('../controllers/user/upload-avatar');
// const searchUsers = require('../controllers/user/search-users');
// const getUserWall = require('../controllers/user/get-user-wall');


const userRouter = express.Router();
// const upload = multer();


userRouter.get('/user', checkJwtToken, getUserProfile);
userRouter.put('/user', checkJwtToken, updateUserProfile);
// router.post('/user/avatar', checkJwtToken, upload.single('avatar'), uploadAvatar);
// router.get('/user/search', checkJwtToken, searchUsers);
// router.get('/user/wall', checkJwtToken, getUserWall);


module.exports = userRouter;
