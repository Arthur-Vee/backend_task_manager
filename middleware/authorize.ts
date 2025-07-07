import express from "express"
import AuthService from "../services/auth.service"

const authService = new AuthService()

export default function authorize(requiredRole: string[]) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization
      const userToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.body.userId

      if (!userToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided" })
      }
      // Verify the User and extract user roles
      const userRoles = await authService.verifyUser(userToken)
      // Check if the user roles are valid and include the required role
      if (!userRoles || !userRoles.some((role) => requiredRole.includes(role))) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" })
      }
      next()
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" })
    }
  }
}
