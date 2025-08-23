import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(token == null) {
        return res.sendStatus(401);
    }
    
    // Use environment variable or fallback secret
    const secret = process.env.ACCESS_TOKEN_SECRET || 'mysecretkey123';
    
    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            return res.sendStatus(403);
        }
        req.email = decoded.email;
        next();
    })
}