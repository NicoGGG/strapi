'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article'), ({ strapi }) => ({
  async find(ctx) {
    // Calling the default core action
    const { data, meta } = await super.find(ctx);
    const query = strapi.db.query('api::[collection-name].[collection-name]');
    await Promise.all(
      data.map(async (item, index) => {
        const foundItem = await query.findOne({
          where: {
            id: item.id,
          },
          populate: ['createdBy', 'updatedBy'],
        });

        data[index].attributes.createdBy = {
          id: foundItem.createdBy.id,
          firstname: foundItem.createdBy.firstname,
          lastname: foundItem.createdBy.lastname,
        };
        data[index].attributes.updatedBy = {
          id: foundItem.updatedBy.id,
          firstname: foundItem.updatedBy.firstname,
          lastname: foundItem.updatedBy.lastname,
        };
      })
    );
    return { data, meta };
  },
  async findOne(ctx) {
    const {id} = ctx.params;
    const {query} = ctx;

    const entity = await strapi.service('api::article.article').findOne(id, query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    sanitizedEntity.createdBy = {
      id: entity.createdBy.id,
      firstname: entity.createdBy.firstname,
      lastname: entity.createdBy.lastname,
    };

    return this.transformResponse(sanitizedEntity);
  }
});
