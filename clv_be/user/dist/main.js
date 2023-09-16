"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_cors_1 = require("./config/config.cors");
const microservices_1 = require("@nestjs/microservices");
const env_1 = require("./common/env");
const kafkajs_1 = require("kafkajs");
const logger = new common_1.Logger('USER_SERVICE');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(config_cors_1.CorsOptions);
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: { brokers: [env_1.KAFKA_BROKER_ID] },
            consumer: { groupId: env_1.KAFKA_USER_CONSUMER_GROUP_ID },
            producer: { createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner },
        },
    });
    await app.startAllMicroservices().then(() => logger.log('KAFKA is running.'));
    await app.listen(env_1.USER_PORT);
    logger.log('is running at: localhost:' + env_1.USER_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map