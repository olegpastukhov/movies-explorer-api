class ConflictError extends Error {
  constructor(message = 'Conflict detected') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
