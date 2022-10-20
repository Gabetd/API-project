'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert('Spots', [{
      ownerId: 1,
      address: '15201 Feather Chase Dr',
      city: 'Chesterfield',
      state: "Virginia",
      country: "United States",
      lat: "37.39",
      lng: "-77.69",
      name: 'Tomahawk Creek',
      description: 'this is a test description',
      price: 340
    }

      // {
      //   ownerId: 1,
      //   address: 'sherbert rd 20 E',
      //   city: 'kansas City',
      //   state: 'Kansas',
      //   country: 'USA',
      //   lat: '1256.3',
      //   lng: '1239.3',
      //   name: 'Ice cream stand',
      //   description: 'We will be working while you stay here, so keep your voices down',
      //   price: 92
      // },
      // {
      //   ownerId: 1,
      //   address: 'E 40 wlabee way sidney',
      //   city: 'kansas City',
      //   state: 'Kansas',
      //   country: 'USA',
      //   lat: '1256.3',
      //   lng: '1239.3',
      //   name: 'dentist office',
      //   description: 'you have to rent our place out for an appointment. DOUBLE PAYMENTS!!!!',
      //   price: 99
      // }
     ], {});
  },

    down: async (queryInterface, Sequelize) => {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
  return queryInterface.bulkDelete('Spots', null, {
      ownerId: 1,
      address: '15201 Feather Chase Dr',
      city: 'Chesterfield',
      state: "Virginia",
      country: "United States",
      latitude: "37.39",
      longitude: "-77.69",
      name: 'Tomahawk Creek',
      description: 'this is a test description',
      price: 340
  }
  // {
  //   ownerId: 1,
  //   address: 'sherbert rd 20 E',
  //   city: 'kansas City',
  //   state: 'Kansas',
  //   country: 'USA',
  //   lat: '1256.3',
  //   lng: '1239.3',
  //   name: 'Ice cream stand',
  //   description: 'We will be working while you stay here, so keep your voices down',
  //   price: 92
  // },
  // {
  //   ownerId: 1,
  //   address: 'E 40 wlabee way sidney',
  //   city: 'kansas City',
  //   state: 'Kansas',
  //   country: 'USA',
  //   lat: '1256.3',
  //   lng: '1239.3',
  //   name: 'dentist office',
  //   description: 'you have to rent our place out for an appointment. DOUBLE PAYMENTS!!!!',
  //   price: 99}
  );
  }
};
