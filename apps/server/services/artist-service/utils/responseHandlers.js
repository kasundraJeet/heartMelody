exports.successResponse = (res, msg) => {
    const data = { success: 1, message: msg };
    return res.status(200).json(data);
  };
  
  exports.successResponseWithData = (res, msg, data) => {
    const resData = { success: 1, message: msg, data: data };
    return res.status(200).json(resData);
  };
  
  exports.errorResponse = (res, msg) => {
    const data = { success: 0, message: msg };
    return res.status(200).json(data);
  };
  
  exports.notFoundResponse = (res, msg) => {
    const data = { success: 0, message: msg };
    return res.status(404).json(data);
  };
  
  exports.validationErrorWithData = (res, msg, data) => {
    const resData = { success: 0, message: msg, data: data };
    return res.status(200).json(resData);
  };
  
  exports.unauthorizedResponse = (res, msg) => {
    const data = { success: 2, message: msg };
    return res.status(200).json(data);
  };
  