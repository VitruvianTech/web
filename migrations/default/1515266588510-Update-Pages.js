import {getModels} from '@machete-platform/core-bundle/lib/Sequelize';

export default class {
  static async up(models, sequelize, DataTypes) {
    const {Page} = getModels();

    await Page.update({
      title: 'VitruvianTech - Plans and Products',
      sections: '["@vitruvian-tech/machete-bundle:Plans"]',
      meta: '[{"name":"description","content":"Learn about our flexible plans and economical product offerings."},{"property":"og:description","content":"Learn about our flexible plans and economical product offerings."},{"property":"twitter:description","content":"Learn about our flexible plans and economical product offerings."},{"property":"og:url","content":"http://Vitruvian.Tech/plans"}]'
    }, {
      where: {
        route: 'plans'
      }
    });
  }

  static async down(models, sequelize, DataTypes) {
    const {Page} = getModels();

    await Page.update({
      title: 'VitruvianTech - Pricing Plans',
      sections: null,
      meta: null
    }, {
      where: {
        route: 'plans'
      }
    });
  }
}