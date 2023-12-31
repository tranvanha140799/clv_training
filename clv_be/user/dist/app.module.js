"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_default_1 = require("./config/config.default");
const config_typeorm_1 = require("./config/config.typeorm");
const config_1 = require("@nestjs/config");
const config_provider_1 = require("./config/config.provider");
const cache_manager_1 = require("@nestjs/cache-manager");
const env_1 = require("./common/env");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                host: 'localhost',
                port: env_1.REDIS_PORT,
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [config_typeorm_1.default, config_default_1.default] }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => configService.get('typeorm'),
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, ...config_provider_1.providers],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map