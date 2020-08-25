import { UserLoginWithGoogle } from './UserLoginWithGoogle';
import { UserLoginController } from './UserLoginWithGoogleController';
import { googleService } from '../../../../shared/services/authProviders';
import { userRepo } from '../../repos';
import { UserLoginRequestController } from './UserLoginRequestController';

const userLogin = new UserLoginWithGoogle(googleService, userRepo);
const userLoginController = new UserLoginController(userLogin);
const userLoginRequestController = new UserLoginRequestController(googleService);

export { userLogin, userLoginController, userLoginRequestController };
