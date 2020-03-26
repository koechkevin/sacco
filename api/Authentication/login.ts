import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {database} from '../database/firebase';

const { compare } = bcrypt;
const { sign, verify } = jwt;

export const authenticate = async (req: any, res: any, next: () => void) => {
  try {
    const authorization = req.headers.authorization;
    const secret = process.env.SECRET_KEY || 'secret key';
    const decoded: any = verify(authorization, secret);
    const { data } = decoded;
    if (data.idNumber) {
      const ref = database.ref(`/users/${data.idNumber}/role`);
      const snap = await ref.once('value');
      const value = snap.val();
      req.user = decoded.data;
      req.user.role = value;
      return next();
    }
    return res.status(401).json({ message: 'invalid token'});
  } catch (error) {
    return res.status(401).json({ message: 'invalid token'});
  }
};

export const allowRoles = (roles: string[]) => async (req: any, res: any, next: () => void) => {
  const { user: { role }} = req;
  if (roles.includes(role)) {
    return next();
  }
  return res.status(403).json({ message: 'You are not authorized to access this path'});
};

export const login = async (req: any, res: any) => {
  try {
    const { id, password } = req.body;
    const ref = database.ref('/users');
    const snapshot = await ref.once('value');
    const users = snapshot.val();
    if (users) {
      const user = Object
        .keys(users)
        .find((user: any) =>
          users[user].idNumber.toString() === id.toString());
      if (user) {
        const match: boolean = await compare(password, users[user].password);
        if (match) {
          const secretKey = process.env.SECRET_KEY || 'secret key';
          const { email, firstName, lastName, idNumber, role } = users[user];
          const token = sign({
            data: { email, firstName, lastName, userId: user, idNumber, role },
          }, secretKey, { expiresIn: '2400000h' });
          return res.status(200).json({ token, role });
        }
      }
    }
    res.status(401).json({ message: 'Oops! wrong credentials'});
  } catch(error){
    res.status(500).json({ message: 'An error Occurred'});
  }
};
