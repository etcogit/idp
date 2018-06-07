var user = require('../models/user')
// require('../models/user')

// Display list of all Users.
exports.user_list = function (req, res) {
  user.find(function (err, users) {
    if (err) return console.error(err)
    // console.log(users)
    res.send(users)
  })
  // res.send('NOT IMPLEMENTED: User list')
}

// Display detail page for a specific User.
exports.user_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: User detail: ' + req.params.id)
}

// Display User create form on GET.
exports.user_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: User create GET')
}

// Handle User create on POST.
exports.user_create_post = function (req, res) {
  console.log(req.params)
  res.send('NOT IMPLEMENTED: User create POST')
}

// Display User delete form on GET.
exports.user_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: User delete GET')
}

// Handle User delete on POST.
exports.user_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: User delete POST')
}

// Display User update form on GET.
exports.user_update_get = function (req, res) {
  /*
  user.where({ rtbfLogin: req.rtbfLogin })
    .update({req},
      res.send({message: req.rtbfLogin + ' a été mis à jour', payload: req})
    )
  */
  console.log(req)
  res.send(req)
}

// Handle User update on POST.
exports.user_update_post = function (req, res) {
  // res.send('NOT IMPLEMENTED: User update POST')
  console.log(req.body)
  res.send(req.params)
}
