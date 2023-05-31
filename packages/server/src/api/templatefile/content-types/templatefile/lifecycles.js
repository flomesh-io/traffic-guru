"use strict";

module.exports = {
  // eslint-disable-next-line no-unused-vars
  afterCreate: async (event) => {
    // const { result, params } = event;
    // const templateFile = await strapi.db.query('api::templatefile.templatefile').findOne({
    //   where: { id: result.id },
    //   populate: {
    //     template: true
    //   }
    // });
    // const template = templateFile.template;
    // if (!template) return;
    // const path = `/flomesh/bases/${template.type}/${template.name}`;
    // await strapi.db.query('api::template.template').update({
    //   where: { id: template.id },
    //   data: {
    //     version: template.version + 1,
    //   },
    // });
    // strapi.service('api::resource.resource').deployBaseRepo(
    //   path,
    //   Object.fromEntries([[result.path, result.content]]),
    //   template.version + 1
    // );
  },
  afterUpdate: async (event) => {
    const { result } = event;
    // 获取修改的templateFile信息
    const templateFile = await strapi.db.query('api::templatefile.templatefile').findOne({
      where: { id: result.id },
      populate: {
        template: true
      }
    });
    // 修改templates表中对应的base repo的version属性
    const template = await strapi.db.query('api::template.template').update({
      where: { id: templateFile.template.id },
      data: {
        version: templateFile.template.version + 1,
      }
    });
    // 根据type类型拼接base repo的路径
    const path = `/flomesh/bases/${template.type}/${template.name}`;
    // 部署base repo
    strapi.service('api::resource.resource').deployBaseRepo(
      path,
      Object.fromEntries([[result.path, result.content]]),
      template.version
    );

  },
  beforeUpdate: async (event) => {
    if (event.params?.data?.content && event.params?.where?.id) {
      strapi.db.query("api::operation-history.operation-history")
        .create({data: {content: event.params.data.content,templatefile: event.params.where.id, updatedBy:event.params.data.updatedBy}})
    }
  }
};  