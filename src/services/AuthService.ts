import UserModel from '../models/user.model';
import { HttpError } from '../util/errorHandler';
import { UserDocument } from '../models/user.model';
import { UserService } from './UserService';

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  firstName: string;
  lastName: string;
}

export class AuthService {
  /**
   * Signup new user
   * @returns UserService instance and auth token
   */
  public static async signup({ email, password, firstName, lastName }: SignupInput) {
    let userDocument = await UserModel.findOne({ email: email });
    //  User already exist
    if (userDocument) throw new HttpError('User already registered.', 400);
    //  User not yet registered
    const hashedPass = await UserModel.hashPassword(password);
    userDocument = new UserModel({
      email: email,
      password: hashedPass,
      profile: {
        firstName,
        lastName
      }
    });
    await userDocument.save();

    return this.newUserSession(userDocument);
  }

  /**
   * Login user
   * @returns UserService instance and auth token
   */
  public static async login({ email, password }: LoginInput) {
    const userDocument = await UserModel.findOne({ email: email });
    //  No user found
    if (!userDocument) throw new HttpError('Invalid email or password.', 400);
    //  User found but invalid password
    const isPassValid = await userDocument.validatePassword(password);
    if (!isPassValid) throw new HttpError('Invalid email or password.', 400);

    return this.newUserSession(userDocument);
  }

  /**
   * Generate user session object
   * @param userDocument queried document from model
   * @returns UserService instance and auth token
   */
  private static async newUserSession(userDocument: UserDocument) {
    const token = userDocument.generateToken();
    const user = new UserService(userDocument._id);

    return { user, token };
  }

  /**
   * Attach new UserService instance using id
   * @param id
   * @returns UserService instance
   */
  public static async attachUser(id: string) {
    const userDocument = await UserModel.findOne({ _id: id });
    if (!userDocument) return;

    return new UserService(userDocument._id);
  }
}
