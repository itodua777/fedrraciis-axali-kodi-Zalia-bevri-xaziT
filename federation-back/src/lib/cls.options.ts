import { ClsModuleOptions } from 'nestjs-cls';

export const clsOptions: ClsModuleOptions = {
    global: true,
    middleware: {
        mount: true,
        setup: (cls, req) => {
            // აქ ვინახავთ იუზერს CLS-ში, რომ შემდეგ პრიზმამ დაინახოს
            cls.set('user', req['user']);
        },
    },
};
