"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const config_docs_1 = require("./config/config.docs");
const app_constants_1 = require("./common/app.constants");
const config_cors_1 = require("./config/config.cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors(config_cors_1.CorsOptions);
    (0, config_docs_1.setupSwagger)(app);
    await app.listen(configService.get(app_constants_1.BE_PORT));
    common_1.Logger.log('[User Service] is running at: localhost:' +
        configService.get(app_constants_1.BE_PORT));
}
bootstrap();
//# sourceMappingURL=main.js.map