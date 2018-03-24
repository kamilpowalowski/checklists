import { Account } from './account.model';
import { User } from './user.model';

export class Profile {
  constructor(
    public account: Account,
    public user: User
  ) { }
}
