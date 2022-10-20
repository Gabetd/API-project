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
  //  try{
     await queryInterface.bulkInsert('SpotImages', [{
      spotId: 1,
      url: "www.badAirBnB's.com",
      preview: false
    //  },
    //  {
    //   spotId: 2,
    //   url: "https://worsteIceCreamStandInAmerica.net",
    //   preview: false
    //  },
    //  {
    //   spotId: 3,
    //   url: "twitter.com/neverGoToThisDentist.blogpost",
    //   preview: false
     }], {});
    // } catch (e) {
    //   console.log(...e.errors)
    //   console.log('*****************',e.message,e.errors[0]);
    // }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('SpotImages', null, {
      spotId: 1,
      url: "www.badAirBnB's.com",
      preview: false
    //  },
    //  {
    //   spotId: 2,
    //   url: "https://worsteIceCreamStandInAmerica.net",
    //   preview: false
    //  },
    //  {
    //   spotId: 3,
    //   url: "twitter.com/neverGoToThisDentist.blogpost",
    //   preview: false
     });
  }
};
