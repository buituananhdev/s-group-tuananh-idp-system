import { createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((data, req) => {
    console.log('data', req);
    return req.user;
});