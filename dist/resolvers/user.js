"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const UserInput_1 = require("./user/UserInput");
const UserResponse_1 = require("./user/UserResponse");
const graphql_type_long_1 = __importDefault(require("graphql-type-long"));
const firebaseConfig_1 = require("../firebaseConfig");
const constants_1 = require("../constants");
let UserResolver = class UserResolver {
    async doesEmailExist(email) {
        const user = await User_1.User.findOne({ where: { email } });
        if (user) {
            return true;
        }
        return false;
    }
    async doesUsernameExist(username) {
        const user = await User_1.User.findOne({ where: { username } });
        if (user) {
            return true;
        }
        return false;
    }
    async doesPhoneNumberExist(phonenumber) {
        const user = await User_1.User.findOne({ where: { phonenumber } });
        if (user) {
            return true;
        }
        return false;
    }
    async register(input, { req }) {
        var _a;
        let user = await User_1.User.findOne({
            where: { phonenumber: input.phoneNumber },
        });
        if (user) {
            return {
                errors: true,
            };
        }
        user = await User_1.User.findOne({
            where: { username: input.username },
        });
        if (user) {
            return {
                errors: true,
            };
        }
        user = await User_1.User.findOne({
            where: { email: input.email },
        });
        if (user) {
            return {
                errors: true,
            };
        }
        const decodedToken = await firebaseConfig_1.authentication.verifyIdToken(input.idToken);
        const uid = decodedToken.uid;
        const userRecord = await firebaseConfig_1.authentication.getUser(uid);
        if (userRecord.phoneNumber) {
            if (input.phoneNumber === parseInt((_a = userRecord.phoneNumber) === null || _a === void 0 ? void 0 : _a.slice(4, 14))) {
                const hashedPassword = await argon2_1.default.hash(input.password);
                const { email, firstname, lastname, phoneNumber, username, wardNo } = input;
                const user = await User_1.User.create({
                    email,
                    firstname,
                    lastname,
                    password: hashedPassword,
                    phonenumber: phoneNumber,
                    username,
                    wardNo,
                    isAdmin: false,
                }).save();
                if (user) {
                    req.session.userId = user.id;
                    return {
                        errors: false,
                        user: user,
                    };
                }
                return {
                    errors: true,
                };
            }
        }
        return {
            errors: true,
        };
    }
    async login(usernameOrNumber, password, { req }) {
        if (!usernameOrNumber) {
            return {
                errors: true,
            };
        }
        if (!password) {
            return {
                errors: true,
            };
        }
        let user = await User_1.User.findOne({ where: { username: usernameOrNumber } });
        if (!user) {
            user = await User_1.User.findOne({
                where: { phonenumber: parseInt(usernameOrNumber) },
            });
            if (!user) {
                return {
                    errors: true,
                };
            }
        }
        const valid = await argon2_1.default.verify(user.password, password);
        if (valid) {
            req.session.userId = user.id;
            return {
                errors: false,
                user: user,
            };
        }
        return {
            errors: true,
        };
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return User_1.User.findOne({ where: { id: req.session.userId } });
    }
    async user(id) {
        const user = await User_1.User.findOne({ where: { id } });
        if (!user) {
            return {
                errors: true,
            };
        }
        return {
            user,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "doesEmailExist", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "doesUsernameExist", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('phonenumber', () => graphql_type_long_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "doesPhoneNumberExist", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)('input', () => UserInput_1.UserInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.UserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)('usernameOrNumber')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map