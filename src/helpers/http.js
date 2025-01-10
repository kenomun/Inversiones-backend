const sendOk = (res, msg, data, code = 200) => {
  return res.status(code).json({
    status: 200,
    error: false,
    msg,
    data,
  });
};

const create201 = (res, msg, data, code = 201) => {
  return res.status(code).json({
    status: 201,
    error: false,
    msg,
    data,
  });
};

const sendOk204 = (res, msg, result, code = 204) => {
  return res.status(code).json({
    status: 204,
    error: false,
    msg,
  });
};

const badRequest = (res, msg, result, code = 400) => {
  return res.status(code).json({
    status: 400,
    error: true,
    msg,
    data: result,
  });
};

const denegateeAccess = (res, msg, result, code = 401) => {
  return res.status(code).json({
    status: 401,
    error: true,
    msg,
    data: result,
  });
};

const permissonDenegate = (res, msg, code = 403) => {
  return res.status(code).json({
    status: 403,
    error: true,
    msg,
  });
};

const error404 = (res, msg, code = 404) => {
  return res.status(code).json({
    status: 404,
    error: true,
    msg,
  });
};

const error409 = (res, msg, code = 409) => {
  return res.status(code).json({
    status: 409,
    error: true,
    msg,
  });
};

const internalError = (res, msg, result, code = 500) => {
  return res.status(code).json({
    status: 500,
    error: true,
    msg,
    data: result,
  });
};

module.exports = {
  sendOk,
  create201,
  badRequest,
  internalError,
  denegateeAccess,
  sendOk204,
  permissonDenegate,
  error404,
  error409,
};
