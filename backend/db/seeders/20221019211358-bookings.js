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

     await queryInterface.bulkInsert('Bookings', [{
       spotId: 1,
       userId: 2,
       startDate: '2022-12-01',
       endDate: '2022-12-01'
      },
      // {
      //   spotId: 2,
      //   userId: 2,
      //   startDate: 10/2/2023,
      //   endDate: 10/4/2023
      // },
      // {
      //   spotId: 3,
      //   userId: 3,
      //   startDate: 10/3/2023,
      //   endDate: 10/4/2023
      // }
    ], {});
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
     await queryInterface.bulkDelete('Bookings', null, {
      spotId: 1,
      userId: 2,
      startDate: '2022-12-01',
      endDate: '2022-12-01'
    //  },
    //  {
    //   spotId: 2,
    //   userId: 2,
    //   startDate: 10/2/2023,
    //   endDate: 10/4/2023
    //  },
    //  {
    //   spotId: 3,
    //   userId: 3,
    //   startDate: 10/3/2023,
    //   endDate: 10/4/2023
     });
  }
};
