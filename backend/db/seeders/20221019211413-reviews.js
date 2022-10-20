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
     await queryInterface.bulkInsert('Reviews', [{
      spotId: 1,
      userId: 2,
      review: "nice hot tub, Terrible everything else",
      stars: 3
    //  },
    //  {
    //   spotId: 2,
    //   userId: 2,
    //   review: "a worker quit halfway through his shift and they made me work",
    //   stars: 1
    //  },
    //  {
    //   spotId: 3,
    //   userId: 3,
    //   review: "most expensive dentist office ever, I had to sleep on the chair overnight.",
    //   stars: 1
     }], {});
    // } catch (e) {
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
     await queryInterface.bulkDelete('Reviews', null, {
      spotId: 1,
      userId: 2,
      review: "nice hot tub, Terrible everything else",
      stars: 3
    //  },
    //  {
    //   spotId: 2,
    //   userId: 2,
    //   review: "a worker quit halfway through his shift and they made me work",
    //   stars: 1
    //  },
    //  {
    //   spotId: 3,
    //   userId: 3,
    //   review: "most expensive dentist office ever, I had to sleep on the chair overnight.",
    //   stars: 1
     });
  }
};
