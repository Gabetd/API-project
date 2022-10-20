'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('ReviewImages', [{
      reviewId: 1,
      url:"www.badAirBnB's.com"
    //  },
    //  {
    //   reviewId: 2,
    //   url:"https://worsteIceCreamStandInAmerica.net"
    //  },
    //  {
    //   reviewId: 3,
    //   url:"twitter.com/neverGoToThisDentist.blogpost"
     }], {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('ReviewImages', null, {
      reviewId: 1,
      url:"www.badAirBnB's.com"
    //  },
    //  {
    //   reviewId: 2,
    //   url:"https://worsteIceCreamStandInAmerica.net"
    //  },
    //  {
    //   reviewId: 3,
    //   url:"twitter.com/neverGoToThisDentist.blogpost"
     });
  }
};
