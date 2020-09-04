import { BaseController } from '../../../../shared/infra/BaseController';
import { UserLoginWithGoogle } from './UserLoginWithGoogle';
import { UserLoginWithGoogleDTO } from './UserLoginWithGoogleDTO';
import { UserSessionDTO } from '../../domain/dtos/UserSessionDTO';

export class UserLoginController extends BaseController {
  private useCase: UserLoginWithGoogle;
  constructor(useCase: UserLoginWithGoogle) {
    super();
    this.useCase = useCase;
  }
  async executeImpl(): Promise<any> {
    const code = this.request.query['code'];
    const dto: UserLoginWithGoogleDTO = { code } as UserLoginWithGoogleDTO;

    const result = await this.useCase.execute(dto);

    if (result.isFailure) return this.unauthorized('unvalid token');

    const userSessionDetails: UserSessionDTO = result.getValue();

    this.request.session['user'] = userSessionDetails;

    return this.response.redirect('http://localhost:8080/');
  }
}
