const errorMiddleware = (error, req, res, next) => {
  const data = error.data || null; 
  const message = error.message || 'Internal Server Error';
  const status = error.status || 500; 
  res.status(status).json({ message, data });
}

export default errorMiddleware;