const { Hotel } = require("./hotel");
const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

function main() {
    const filename = "input.txt";
    const commands = getCommandsFromFileName(filename);
    const hotel = new Hotel();
  
    commands.forEach((command) => {
      switch (command.name) {

        case "create_hotel":
          const [floor, roomPerFloor] = command.params;
        /* Check minimum floor level, minimum and maximum room per floor */
          if(floor < 1 || roomPerFloor < 1 || roomPerFloor > 99) {
            return console.log("The number of floor should be more than 0 and number of room per floor should be more than 0 and less than 100.");
          } else {
            hotel.createRooms(floor, roomPerFloor);
          }
          break;

        case "book":
            const [roomNumber,guestName,age] = command.params;
            hotel.book(roomNumber,guestName,age);
            break;

        case "book_by_floor":
            const [bookFloor,bookFloorName,bookFloorAge] = command.params;
            hotel.bookByFloor(bookFloor,bookFloorName,bookFloorAge);
            break;
        
        case "checkout":
            const [keycardNumber,checkoutName] = command.params;
            hotel.checkout(keycardNumber,checkoutName);
            break;

        case "checkout_guest_by_floor":
            const checkoutFloor = command.params;
            hotel.checkoutGuestByFloor(...checkoutFloor);
            break;

        case "list_available_rooms":
            hotel.listAvailableRooms();
            break;

        case "list_guest":
            hotel.listGuest();
            break;

        case "list_guest_by_age":
            const [operator,ageCondition] = command.params;
            switch(operator) {
                case ">":
                    hotel.listGuestByAge(function(a,b) { return a > b },ageCondition );
                    break;
                case ">=":
                    hotel.listGuestByAge(function(a,b) { return a >= b },ageCondition );
                    break;
                case "<":
                    hotel.listGuestByAge(function(a,b) { return a < b },ageCondition );
                    break;
                case "<=":
                    hotel.listGuestByAge(function(a,b) { return a <= b },ageCondition );
                    break;
                case "==":
                    hotel.listGuestByAge(function(a,b) { return a == b },ageCondition );
                    break;
                case "!=":
                    hotel.listGuestByAge(function(a,b) { return a != b },ageCondition );
                    break;
            }
            break;

        case "list_guest_by_floor":
            const searchFloor = command.params;
            hotel.listGuestByFloor(...searchFloor);
            break;

        case "get_guest_in_room":
            const number = command.params;
            hotel.getGuestInRoom(...number);
            break;

        default:
          return;
      }
    });
    // hotel.getInfo();
  }


main();

