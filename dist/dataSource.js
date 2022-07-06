"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const Complain_1 = require("./entities/Complain");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
exports.dataSource = new typeorm_1.DataSource({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    logging: false,
    synchronize: true,
    entities: [Complain_1.Complain, User_1.User],
    migrations: [path_1.default.join(__dirname, './migrations/*')],
    ssl: {
        rejectUnauthorized: false,
    },
});
//# sourceMappingURL=dataSource.js.map