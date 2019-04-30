exports.responseSuccess = (httpCode, status, message, data, res) => {
  var dataJson = {
    "status": status,
    "message": message,
    "data": data
  }
  res.status(httpCode)
  res.json(dataJson)
  res.end()
}

// exports.responseError = (httpCode, status, message, errors, res) => {
exports.responseError = (httpCode, errors, res) => {
  var dataJson = {
    // "status": status,
    // "message": message,
    "error": errors
  }
  res.status(httpCode)
  res.json(dataJson)
  res.end()
}