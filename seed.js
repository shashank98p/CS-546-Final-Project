import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { eventsData, userData } from './data/index.js';

const main = async () => {
  const db = await dbConnection();
//   await db.dropDatabase();

//   const userOne = {
//     firstName: "Emma",
//     lastName: "Smith",
//     userName: "PixelPenguin22",
//     email: "emma.smith@stevens.edu",
//     password: "Kt9J$y#h@Lm",
//     DOB: "06-23-2001",
//   };


//   try {
//     const user = await userData.createUser(
//       userOne.firstName,
//       userOne.lastName,
//       userOne.userName,
//       userOne.email,
//       userOne.password,
//       userOne.DOB
//     );
//   } catch (e) {
//     console.log(e);
//   }

  const eventOne = {
    eventName: "Spring Fling Festival",
    description: "A celebration of the arrival of spring, featuring live music, food trucks, and carnival games",
    buildingName: "Stevens Institute of Technology Campus Green",
    organizer: "Stevens Student Government Association",
    seatingCapacity: 100,
    // image: "random",
    userId: "129019201920192"
  };

  // try {
  //   const event = await eventsData.createEvent(eventOne.eventName, eventOne.description, eventOne.buildingName, eventOne.organizer, eventOne.seatingCapacity, eventOne.userId);
  //   console.log(event);
  // } catch (e) {
  //   console.log(e);
  // }

  //   try {
  //   const event = await eventsData.getAllEvents();
  //   console.log(event);
  // } catch (e) {
  //   console.log(e);
  // }

  // try {
  //   const event = await eventsData.getEventByID("643f33430af63b71dc165d3e");
  //   console.log(event);
  // } catch (e) {
  //   console.log(e);
  // }

  // try {
  //   const event = await eventsData.removeEventById("643f33430af63b71dc165d3e");
  //   console.log(event);
  // } catch (e) {
  //   console.log(e);
  // }

  try {
    const event = await eventsData.updateEvent("643f33430af63b71dc165d3e", eventOne.eventName, eventOne.description, eventOne.buildingName, eventOne.organizer, eventOne.seatingCapacity);
    console.log(event);
  } catch (e) {
    console.log(e);
  }

  console.log("Done");
  await closeConnection();
} 

main();
