export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    // Distinguishes errors raised on purpose from genuine crashes, so the
    // handler knows which messages are safe to send to the client.
    this.isOperational = true;
  }
}
