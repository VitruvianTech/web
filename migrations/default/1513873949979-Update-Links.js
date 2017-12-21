import {getModels} from '@machete-platform/core-bundle/lib/Sequelize';

export default class {
  static async up(models, sequelize, DataTypes) {
    const {Link} = getModels();

    await Link.update({
      href: '/dist/623df8fdb189ee61f583f64d0dbead0c.png'
    }, {
      where: {
        href: '/dist/51883aaa25eec87770e2b91e169c9609.png'
      }
    });
  }

  static async down(models, sequelize, DataTypes) {
    const {Link} = getModels();

    await Link.update({
      href: '/dist/51883aaa25eec87770e2b91e169c9609.png'
    }, {
      where: {
        href: '/dist/623df8fdb189ee61f583f64d0dbead0c.png'
      }
    });
  }
}
