import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/generateToken";
import { isAuth } from "../../middleware/isAuth";

describe("isAuth middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  it("Should throw an error if no authorization header is present", () => {
    mockRequest = { headers: {} };

    expect(() =>
      isAuth(mockRequest as Request, mockResponse as Response, nextFunction)
    ).toThrow();
  });

  it("Should call next function if authorization header is present", () => {
    const token = generateToken(1);
    mockRequest.headers! = { authorization: `Bearer ${token}` };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
  });
});
