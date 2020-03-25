import {database} from './firebase';

interface User {
  firstName: string;
  lastName: string;
  idNumber: number | string;
  firstContributionDate: string;
  monthlyContribution: number;
  role: 'admin' | 'user',
  authKey?: string,
  email?: string;
  phone?: string | number;
  password?: string;
}

export const createUser = async (user: User) => {
  try {
    const { idNumber } = user;
    const ref = database.ref(`/users/${idNumber}`);
    await ref.update(user);
    const snapshot = await ref.once('value');
    return snapshot.val();
  } catch (error) {
    throw error;
  }
};

export const getUser = async (idNumber: string | number): Promise<User | undefined> => {
  try {
    const ref = database.ref(`/users/${idNumber}`);
    const snapshot = await ref.once('value');
    const user: User = snapshot.val();
    if (user) {
      const { password, authKey, ...rest} = user;
      return rest;
    }
  } catch (error) {
  throw error;
}
}

export const updateUser = async (user: User) => {
  try {
    const { idNumber, ...rest } = user;
    const ref = database.ref(`/users/${idNumber}`);
    await ref.update(rest);
    const snapshot = await ref.once('value');
    return snapshot.val();
  } catch (error) {
    throw error;
  }
};

