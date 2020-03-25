import { createUser, getUser, updateUser } from '../database/createUser';
import { database } from '../database/firebase';
import bcrypt from 'bcrypt';
import { sendEmail } from '../emailService';

const { hash } = bcrypt;

export const validateAdminCreate = async (req: { body: any }, res: any, next: any) => {
  const { body } = req;
  const { idNumber, firstContributionDate, email } = body;
  if (email && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
    return res.status(422).json({ message: 'Please enter a valid email' });
  }
  if (!idNumber || !firstContributionDate) {
    return res.status(422).json({ message: 'idNumber and firstContributionDate are required' });
  }
  next();
};

export const validateNewPassword = async (req: any, res: any, next: () => void) => {
  const { id, auth_key } = req.query;
  const { password } = req.body;
  if (!id || !auth_key || auth_key === 'null') {
    return res.status(404).json({ message: 'Missing params' });
  }
  if (!/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password)) {
    return res.status(422).json({
      message:
        'Password should contain at least 1 upper case letter, 1 lower case, 1 number or special character and at least 8 characters',
      field: 'password',
    });
  }
  next();
};

export const fillNewPassword = async (req: any, res: any, next: any) => {
  try {
    const { id, auth_key } = req.query;
    const { password } = req.body;
    const ref = database.ref(`/users/${id}`);
    const userSnapshot = await ref.once('value');
    const user = userSnapshot.val();
    if (!user) {
      return res.status(404).json({
        message: 'The link you provided is invalid',
      });
    }
    if (user.authKey !== auth_key || !user.authKey) {
      return res.status(404).json({
        message: 'We could not find a user that matches the credentials provided',
      });
    }
    if (user.authKey === auth_key) {
      const hashedPassword = await hash(password, 10);
      await ref.update({ password: hashedPassword, authKey: null });
      req.body = { password, id };
      return next();
    }
    res.status(400).json({ message: 'An error Occured' });
  } catch (error) {
    res.status(500).json({ message: 'An error Occured' });
  }
};

export const sendPassWordResetLink = async (req: any, res: any) => {
  try {
    const { idNumber } = req.body;
    if (!idNumber) {
      return res.status(422).json({ message: 'idNumber required' });
    }
    const ref = database.ref(`/users/${idNumber}`);
    const snapshot = await ref.once('value');
    const value = snapshot.val();
    if (value) {
      const authKey = await hash(Math.random().toString(), 10);
      await database.ref(`/users/${idNumber}`).update({ authKey });
      const text = `Follow the link below to reset your password ${req.headers.origin}/auth/create-password`;
      if (value.email) {
        await sendEmail({
          subject: 'Create a new password',
          to: value.email,
          text: `${text}?auth_key=${authKey}&id=${idNumber}`,
        });
      }
      return res.status(200).json({ message: 'success' });
    }
    res.status(404).json({ message: 'Not found', idNumber });
  } catch (error) {
    res.status(500).json({ message: 'An error Occured' });
  }
};

export const adminRegisterUser = async (req: any, res: { status: (arg0: number) => any }) => {
  try {
    const { body } = req;
    const { password, ...restUser } = body;
    const authKey = await hash(Math.random().toString(), 10);
    const user = { ...restUser, authKey };
    const createdUser = await createUser(user);
    res.status(200).json({ user: createdUser });
  } catch (e) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

export const updateMyProfile = (req: any, res: { status: (arg0: number) => any }) => {
  try {
    const {
      user: { userId },
    } = req;
    const { password, firstContributionDate, idNumber, monthlyContribution, authKey, role, ...rest } = req.body;
    const userToUpdate = { ...rest, idNumber: userId };
    const response = updateUser(userToUpdate);
    return res.status(200).json({ user: response });
  } catch (e) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

export const adminUpdate = (req: any, res: { status: (arg0: number) => any }) => {
  try {
    const { password, ...rest } = req.body;
    const userToUpdate = { ...rest };
    const response = updateUser(userToUpdate);
    return res.status(200).json({ user: response });
  } catch (e) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

export const getUserData = async (req: any, res: { status: (arg0: number) => any }) => {
  try {
    const {
      user: { userId },
    } = req;
    if (userId) {
      const user = await getUser(userId);
      if (user) {
        return res.status(200).json({ user });
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (e) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

export const listUsers = async (req: any, res: { status: (arg0: number) => any }) => {
  try {
    const ref = database.ref('/users');
    const snapshot = await ref.once('value');
    const list = snapshot.val();
    const users = Object.values(list).map((user: any) => {
      const { password, ...rest } = user;
      return rest;
    });
    res.status(200).json({ users });
  } catch (e) {
    res.status(500).json({ message: 'An error occurred' });
  }
};
