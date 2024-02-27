import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, {
        secret:
          'HXquty81BymzPbSFKqU1yZpcevokUZ9d1YyHCzK4moXRIN9UZHKFyDyzvf9Zu02T3Xw7xkrCdvRGkoLxAQTEB+rsUFN5ufu3pRGlS9BpZ+Bk8xr7DH7XLrxjdPAJZlcwnx/detktRIVu0zbmkewPX+YSRweNA5hwYCaQhMBkpzVv7jsx5eIiMSeGBkADWCN7saau2kwAYmOw4AvCvl9jRdP5KRp8FisEBU9MHlI0kfN8qgxK1RTSekpc3ZuFVU22RnN8FqptxgzzbtnUD4RNw1GQEvrmHbQ08OSaYSoSm4FWrXLGbAmRUsvzfsssxkddGCp6cdh9r5+wPVnKuPylhw==',
      });
      request.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }
}
