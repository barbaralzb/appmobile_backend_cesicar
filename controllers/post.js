const express = require('express')
const asyncHandler = require('../middleware/async')
const { __uploadImage } = require('../middleware/uploadAws')
// Modelos
const Post = require('../models/Post')
const User = require('../models/User')

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  Post.find().sort('-publicationdate').populate('user').exec(function (err, posts) {
    if (err) res.status(500).send(err)
    else res.status(200).json(posts)
  })
})

exports.getPost = asyncHandler(async (req, res, next) => {
  Post.findOne({ _id: req.params.id }, function (err, postinfo) {
    if (err) {
      res.status(404).json({
        error: 'Not found'
      })
    } else res.status(200).json(postinfo)
    next()
  })
})

exports.getAllPostsUser = asyncHandler(async (req, res, next) => {
  Post.find({ user: req.params.id }).sort('-publicationdate').exec(function (err, posts) {
    if (err) res.status(500).json(500)
    else res.status(200).json(posts)
  })
})

exports.createPost = asyncHandler(async (req, res, next) => {
  // aca estoy sacando el iduser decodificado del token gracias al middleware
  const { iduser } = req
  // desustructuracion de req.body
  try {
    const {
      title,
      description,
      dateStart,
      dateEnd,
      fullDay,
      timeStart,
      timeEnd,
      address,
      city,
      postalCode,
      ageRange,
      domain,
      email,
      website,
      facebook,
      instagram,
      twitter,
      isActive,
      createdAt
    } = req.body
    const image = req.files
    console.log('aca estab req.image', image)
    const imageResponse = await __uploadImage(image)
    console.log('aca esto image response', imageResponse)

    User.findById(iduser, function (err, userinfo) {
      if (err) res.status(500).res('hubo un error antes de la instancia, token.id no existe en la db' + 500)
      else {
      // crear la instancia Post
        const postInstance = new Post({
          user: req.iduser,
          title,
          description,
          dateStart,
          dateEnd,
          fullDay,
          timeStart,
          timeEnd,
          address,
          city,
          postalCode,
          ageRange,
          domain,
          email,
          website,
          facebook,
          instagram,
          twitter,
          isActive,
          images: imageResponse || null,
          createdAt
        })
        // añadir postInstance al array de posts del usuario
        userinfo.posts.push(postInstance)
        // salvaar el post en las colecciones users y posts
        userinfo.save(function (err) {
          if (err) res.status(500).send('hubo un error guardar el post' + err)
          else {
            postInstance.save(function (err) {
              if (err) {
                res.status(500).send({
                  success: false,
                  err
                })
              } else {
                res
                  .status(200)
                  .send({
                    success: true
                  })
              }
            })
          }
        })
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(404).send(error.message)
  }
})

// exports.updatePost = asyncHandler(async (req, res, next) => {
//   Post.findByIdAndUpdate(req.params.id, req.body, function (err, postinfo) {
//     if (err) {
//       res.status(500).send({
//         success: false,
//         err: 'se produjo un error al update post' + err
//       })
//     } else {
//       res
//         .status(200)
//         .send({
//           success: true
//         })
//     }
//   })
// })

exports.updatePost = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      description,
      dateStart,
      dateEnd,
      timeStart,
      timeEnd,
      address,
      city,
      postalCode,
      ageRange,
      domain,
      email,
      website,
      facebook,
      instagram,
      twitter
    } = req.body
    console.log('req : ', req)
    const image = req.files
    console.log('body : ', req.body)
    console.log('req files : ', req.files)
    const imageResponse = await __uploadImage(image)
    console.log('images uploaded to s3 : ', imageResponse)
    await Post.findByIdAndUpdate(req.params.id, {
      title,
      description,
      dateStart,
      dateEnd,
      timeStart,
      timeEnd,
      address,
      city,
      postalCode,
      ageRange,
      domain,
      email,
      website,
      facebook,
      instagram,
      twitter,
      image: imageResponse ? imageResponse[0] : null
    }, { new: true }).then(userUpdated => {
      res
        .status(200)
        .send({
          success: true,
          data: userUpdated
        })
    }).catch(error => {
      console.log(error)
      return res.status(505).send('hubo un error guardar el user' + error.message)
    })
  } catch (error) {
    console.log(error)
    return res.status(404).send(error.message)
  }
})

exports.deletePost = asyncHandler(async (req, res, next) => {
  Post.findByIdAndDelete(req.params.id, function (err, postinfo) {
    if (err) res.status(500).send(err)
    else {
      User.findByIdAndUpdate(postinfo.user, { $pull: { post: postinfo._id } }, function (err, userinfo) {
        if (err) {
          res.status(500).send({
            success: false,
            err
          })
        } else {
          res
            .status(200)
            .send({
              success: true
            })
        }
      })
    }
  })
})
