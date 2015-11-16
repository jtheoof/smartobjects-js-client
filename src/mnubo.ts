import * as _ from 'lodash';

import {base64Encode} from './utils/underscore';
import {http} from './http/http';
import {RequestOptions} from './http/request';

export enum OAuth2Scopes {
  ALL,
  LIMITED,
  READ,
  WRITE
}

export enum Environments {
  SANDBOX,
  PRODUCTION
}

interface AccessTokenPayload {
  grantType: string;
  scope: OAuth2Scopes;
}

export class Client {
  constructor(private id: string, private secret: string, private env?: Environments,
    private options?: RequestOptions) {
      if (env === undefined) {
        this.env = Environments.SANDBOX;
      }

      if (!options) {
        this.options = {
          protocol: 'https',
          hostname: `rest.${Environments[this.env].toLowerCase()}.mnubo.com`,
          port: 443
        };
      }
    }

    getAccessToken(scope: OAuth2Scopes) {
      scope = scope || OAuth2Scopes.ALL;

      var payload: string = `grant_type=client_credentials&scope=${OAuth2Scopes[scope].toUpperCase()}`;

      var options: RequestOptions = {
        path: '/oauth/token',
        headers: new Map<string, string>()
      };

      options.headers.set('Authorization', `Basic ${base64Encode(this.id + ':' + this.secret)}`);
      options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      options.headers.set('Accept-Encoding', 'application/json');

      _.merge(options, this.options);

      return http.post(options, payload);
    }
  }
