class Hotel {
    constructor() {
        /* Set default minimum floor and room per floor and total room numbers */
        this.rooms = [];
        this.keycards = [];
        this.totalRoom = 0;
    }

    createRooms(floor, roomPerFloor) {
        this.totalRoom = floor * roomPerFloor;
        /* Create rooms */
        for(let i=0;i<=floor-1;i++) {
            this.rooms.push([]);
            for(let j=0;j<=roomPerFloor-1;j++) {
                this.rooms[i].push(
                    /* booked:false, guest:{} and keycard:0 mean no guest in the room */
                    {
                        number : ((i+1) * 100) + (j+1),
                        floor : (i+1),
                        booked : false,
                        keycard : 0,
                        guest : {}
                    }
                )
            }
        }
        /* create Keycards */
        for(let card=1;card<=this.totalRoom;card++) this.keycards.push(card);
        console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`);
    }

    book(roomNumber,guestName,age) {
        if(roomNumber && guestName && age) {
            
            const floor = Math.floor(roomNumber/100);
            if(roomNumber < 100) return console.log(`The room number should be at least 3 digits.`);
            if(floor < 1 || floor > this.rooms.length) return console.log(`There is no floor level ${floor} in the hotel.`);

            const roomIndex = this.rooms[floor-1].findIndex( room => room.number == roomNumber );
            /* Check if the room is valid */
            if(roomIndex != -1) {
                /* Check if the room is available */
                if(this.rooms[floor-1][roomIndex].booked) {
                    console.log(`Cannot book room ${roomNumber} for ${guestName}, The room is currently booked by ${this.rooms[floor-1][roomIndex].guest.name}.`)
                } else {
                    /* Always give the first keycard in the arr */
                    const gaveKeycard = this.keycards.shift();

                    this.rooms[floor-1][roomIndex].booked = true;
                    this.rooms[floor-1][roomIndex].keycard = gaveKeycard;
                    this.rooms[floor-1][roomIndex].guest.name = guestName;
                    this.rooms[floor-1][roomIndex].guest.age = age;

                    console.log(`Room ${roomNumber} is booked by ${guestName} with keycard number ${gaveKeycard}.`)
                }

            } else {
                console.log(`Room number ${roomNumber} is not founded.`);
            }

        } else {
            console.log(`Room number, Reservation name and age is required.`);
        }

    }

    bookByFloor(floor,name,age){

        /* Check if floor level valid */
        if(floor < 1 || floor > this.rooms.length) console.log(`There is no floor level ${floor} in the hotel.`)
        else {
            /* Check if one of the rooms in the floor are already booked. */
            let alreadyBooked = false;
            for(let i=0;i<this.rooms[floor-1].length;i++) {
                if(this.rooms[floor-1][i].booked) {
                    alreadyBooked = true;
                    break;
                }
            }

            if(alreadyBooked) console.log(`Cannot book floor ${floor} for ${name}.`);
            else {
                const bookedRoom = [];
                const gaveKeycards = [];

                this.rooms[floor-1].forEach( room => {
                    /* Always give the first keycard in the arr */
                    const gaveKeycard = this.keycards.shift();

                    room.booked = true;
                    room.keycard = gaveKeycard;
                    room.guest.name = name;
                    room.guest.age = age;
                    bookedRoom.push(room.number);
                    gaveKeycards.push(room.keycard);
                })

                console.log(`Room ${bookedRoom.join(", ")} are booked with key card number ${gaveKeycards.join(", ")}.`)
            }
        }

    }

    checkout(keycardNumber,checkoutName) {
        /* The keycard number should be more than 0 and less than equal the total room. */
        if(keycardNumber<1) return console.log(`The keycard number should be more than 0.`);
        else if(keycardNumber > this.totalRoom) return console.log(`The total room number is ${this.totalRoom}. The Keycard number is wrong.`);
        /* Check all keycards on the admin desk */
        /* If one of the cards that hold by admin match the checkout keycard, this mean that the keycard number is wrong. */
        if(this.keycards.findIndex(card => card === keycardNumber) !== -1) return console.log(`The keycard number ${keycardNumber} is currently hold by admin. Please return the booked room keycard.`);

        /* Then get the room number for checkout */
        let checkoutRoomNumber ;
        let roomOwner ;
        this.rooms.forEach( floor => floor.forEach( room => {
            if(room.keycard===keycardNumber && room.guest.name===checkoutName) {
                checkoutRoomNumber = room.number;
                /* return the keycard and then sort */
                this.keycards.push(room.keycard);
                this.keycards.sort( (a,b)=> a-b );
                /* Reset reservation details to default */
                room.booked = false;
                room.keycard = 0;
                room.guest = {};
            } else if (room.keycard===keycardNumber) {
                /* Get room owner name incase only keycard number matched */
                roomOwner = room.guest.name;
            }
        }))
        /* If checkoutRoomNumber is founded by Keycard that mean succesfully checkout. */
        /* If not, Tell the guest who is the card holder. */
        checkoutRoomNumber ? console.log(`Room ${checkoutRoomNumber} is checkout.`) : console.log(`Only ${roomOwner} can checkout with keycard number ${keycardNumber}.`);
    }

    checkoutGuestByFloor(floor) {
        /* Check if floor level valid */
        if(floor < 1 || floor > this.rooms.length) console.log(`There is no floor level ${floor} in the hotel.`)
        else {
            const checkoutRoom = [];
            /* Floor - 1 is the index of the floor array */
            /* filter only name and remove undefined value */
            this.rooms[floor-1].forEach( room => {
                if(room.booked) {
                    /* return the keycard and then sort */
                    this.keycards.push(room.keycard);
                    this.keycards.sort( (a,b)=> a-b );
                    /* Reset reservation details to default */
                    room.booked = false;
                    room.keycard = 0;
                    room.guest = {};
                    /* Add room number into display array */
                    checkoutRoom.push(room.number);
                }
            })
            checkoutRoom.length!=0 ? console.log(`Room ${checkoutRoom.join(", ")} are checkout.`) : console.log('There is no guest on the floor.');
        }
    }

    listAvailableRooms() {
        const availableRooms = this.rooms.map(floor => floor.filter( room => room.booked === false));
        /* Create displaying array for display the available 'rooms number' in one line. */
        const remainingRooms = [];
        for(let i=0;i<availableRooms.length;i++) availableRooms[i].forEach( room => remainingRooms.push(room.number));
        remainingRooms.length!=0 ? console.log(remainingRooms.join(", ")) : console.log('There is no available room now.');
    }

    listGuest() {
        /* Filter only name and defined value from 2D array */
        const guestNames = this.rooms.map(floor => floor.map( room => room.guest.name ))
                            .map( floor => floor.filter( roomname => roomname !== undefined ) );
        /* Push the guest name to new displaying array then use set for filter only unique values */
        let guestNameArr = [];
        guestNames.forEach( floor =>  floor.forEach( name => guestNameArr.push(name) ));     
        guestNameArr = [...new Set(guestNameArr)];
        guestNameArr.length!=0 ? console.log(guestNameArr.join(", ")) : console.log('There is no guest now.');
    }

    listGuestByAge(operator,ageCondition) {
        /* Filter only name and defined value from 2D array */
        let names = [];
        /* Check if the age is pass the condition, then add the name to displaying array */
        for(let i=0;i<=this.rooms.length-1;i++) {
            this.rooms[i].forEach( room => {
                const isPass = operator(room.guest.age,ageCondition);
                if(isPass) names.push(room.guest.name);
            });
        }
        names = new Set(names.filter( name => name != undefined));
        [...names].length != 0 ? console.log([...names].join(", ")) : console.log('No guest matched.');
    }

    listGuestByFloor(floor){
        /* Check if floor level valid */
        if(floor < 1 || floor > this.rooms.length) console.log(`There is no floor level ${floor} in the hotel.`)
        else {
            /* Floor - 1 is the index of the floor array */
            /* filter only name and remove undefined value */
            let guestNameArr = this.rooms[floor-1].map( room => room.guest.name).filter( name => name !== undefined);
            guestNameArr = [...new Set(guestNameArr)];
            guestNameArr.length!=0 ? console.log(guestNameArr.join(", ")) : console.log('There is no guest in this floor.');
        }
    }

    getGuestInRoom(roomNumber){
        /* Check if the room number is valid */
        let foundRoom = false;
        this.rooms.forEach( floor => floor.forEach( room => {
            if(room.number === roomNumber) foundRoom = true;
        }))
        /* Find the guest name from the room number */
        if(foundRoom) {
            const guestInRoom = [];
            /* Filter only name that matched roomNumber and already booked from 2D array */
            this.rooms.forEach( floor => floor.forEach( room => {
                if(room.number===roomNumber && room.booked) guestInRoom.push(room.guest.name);
            }))
            guestInRoom.length != 0 ? console.log(...guestInRoom) : console.log('No guest in this room.');
        } else {
            console.log(`There is no room number:${roomNumber} in the hotel.`);
        }
    }

    /* For Trouble shooting */
    getInfo() {
        this.rooms.length!=0 ? this.rooms.forEach( floor => console.log(floor)) : console.log("There is no room created.");
        this.keycards.length!=0 ? console.log("Remaining keycards are " + this.keycards) : console.log("No keycard left.");
    }
}

module.exports = {
    Hotel
}