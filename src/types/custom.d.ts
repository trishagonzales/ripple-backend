import { UserService } from '../services/UserService';

declare global {
  namespace Express {
    export interface Request {
      user: UserService;
      files: any;
    }
  }
}
