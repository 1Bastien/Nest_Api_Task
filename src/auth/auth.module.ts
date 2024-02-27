import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret:
        'HXquty81BymzPbSFKqU1yZpcevokUZ9d1YyHCzK4moXRIN9UZHKFyDyzvf9Zu02T3Xw7xkrCdvRGkoLxAQTEB+rsUFN5ufu3pRGlS9BpZ+Bk8xr7DH7XLrxjdPAJZlcwnx/detktRIVu0zbmkewPX+YSRweNA5hwYCaQhMBkpzVv7jsx5eIiMSeGBkADWCN7saau2kwAYmOw4AvCvl9jRdP5KRp8FisEBU9MHlI0kfN8qgxK1RTSekpc3ZuFVU22RnN8FqptxgzzbtnUD4RNw1GQEvrmHbQ08OSaYSoSm4FWrXLGbAmRUsvzfsssxkddGCp6cdh9r5+wPVnKuPylhw==',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
