import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if(authHeader === null || authHeader === undefined) {
    return res.status(401).json({message: "UnAuthorized User"})
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if(err) return res.status(401).json({status: 401, message: "UnAuthorised User"});
      req.user = user as AuthUser;
      next();
  })
}

export default authMiddleware;