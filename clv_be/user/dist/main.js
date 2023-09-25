"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const config_cors_1 = require("./config/config.cors");
const env_1 = require("./common/env");
const logger = new common_1.Logger('USER_SERVICE');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(config_cors_1.CorsOptions);
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: env_1.APP_DOMAIN,
            port: +env_1.USER_PORT,
        },
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: { brokers: [env_1.KAFKA_BROKER_ID] },
            consumer: { groupId: env_1.KAFKA_USER_CONSUMER_GROUP_ID },
            producer: { createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner },
        },
    });
    await app.startAllMicroservices();
    await app.listen(env_1.USER_PORT);
    logger.log('is running on port:' + env_1.USER_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map