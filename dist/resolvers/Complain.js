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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplainResolver = void 0;
const isAuth_1 = require("../utils/middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Complain_1 = require("../entities/Complain");
const dataSource_1 = require("../dataSource");
const ComplainInput_1 = require("./complain/ComplainInput");
let PaginatedComplains = class PaginatedComplains {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Complain_1.Complain]),
    __metadata("design:type", Array)
], PaginatedComplains.prototype, "complains", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedComplains.prototype, "hasMore", void 0);
PaginatedComplains = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedComplains);
let ComplainResolver = class ComplainResolver {
    descriptionSnippet(root) {
        return root.description.slice(0, 50);
    }
    async complains(limit, cursor) {
        const realLimit = limit >= 50 ? 50 : limit;
        const realLimitPlusOne = realLimit + 1;
        const complain = dataSource_1.dataSource
            .getRepository(Complain_1.Complain)
            .createQueryBuilder('p')
            .orderBy('"createdAt"', 'DESC')
            .take(realLimitPlusOne);
        if (cursor) {
            complain.where('p."createdAt" < :cursor', {
                cursor: new Date(parseInt(cursor)),
            });
        }
        const complains = await complain.getMany();
        const complainsWithHasMore = {
            complains: complains.slice(0, realLimit),
            hasMore: complains.length === realLimitPlusOne,
        };
        return complainsWithHasMore;
    }
    complain(id) {
        return Complain_1.Complain.findOne({ where: { id } });
    }
    async createPost(input, { req }) {
        const complain = await Complain_1.Complain.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId })).save();
        return complain;
    }
    async updatePost(id, title) {
        const post = await Complain_1.Complain.findOne({ where: { id } });
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await Complain_1.Complain.update({ id }, { title });
        }
        return post;
    }
    async deletePost(id) {
        try {
            await Complain_1.Complain.delete(id);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Complain_1.Complain]),
    __metadata("design:returntype", String)
], ComplainResolver.prototype, "descriptionSnippet", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedComplains),
    __param(0, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('cursor', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ComplainResolver.prototype, "complains", null);
__decorate([
    (0, type_graphql_1.Query)(() => Complain_1.Complain, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplainResolver.prototype, "complain", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Complain_1.Complain),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ComplainInput_1.ComplainInput, Object]),
    __metadata("design:returntype", Promise)
], ComplainResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Complain_1.Complain, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ComplainResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplainResolver.prototype, "deletePost", null);
ComplainResolver = __decorate([
    (0, type_graphql_1.Resolver)(Complain_1.Complain)
], ComplainResolver);
exports.ComplainResolver = ComplainResolver;
//# sourceMappingURL=Complain.js.map