import { NbAuthOptions } from '@nebular/auth';
import { FirebaseAuthenticationProvider } from '../shared/services/firebase-authentication.provider';

export const authModuleSettings: NbAuthOptions = {
  providers: {
    email: {
      service: FirebaseAuthenticationProvider
    },
  },
  forms: {
    validation: {
      password: { minLength: 6 },
      fullName: { required: true }
    }
  }
};
