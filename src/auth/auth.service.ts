import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ACCESS_SERVER_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_URL,
} from 'src/common/constants/env.constants';
import { generateLoginFun } from 'src/common/helpers/oauth2.helper';
import * as qs from 'qs';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { UserFromJwt } from 'src/common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  redirectAccessService() {
    const redirectUrl = generateLoginFun();
    return redirectUrl;
  }

  async getTokens(code: string, res: Response) {
    const url = `${ACCESS_SERVER_URL}/v1/auth/token`;

    const response = await firstValueFrom(
      this.httpService.post(
        url,
        qs.stringify({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: `${CLIENT_URL}/auth/access`,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    const { access_token, refresh_token, id_token } = response.data;

    console.log(response.data)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1 час
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 дней
    });

    const decoded = jwt.decode(id_token) as UserFromJwt;

    return res.json({
      user: {
        email: decoded.email,
      },
      access_token,
      refresh_token,
    });
  }
}
