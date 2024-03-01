const fs = require('fs');

// O(n^2) time complexity
// O(1) space complexity

fs.readFile('Input.txt', 'utf8', (err, data) => { //  O(1)
  if (err) {
    console.error(err);
    return;
  }
  processInput(data);
});

function processInput(input) {
    const lines = input.trim().split('\n');
    const drones = getDroneNames(lines[0]); // O(n)
    orderDronesByCapacity(drones); // O(n log n)
    const locations = getLocations(lines.slice(1)); // O(n)
    orderLocationsByWeight(locations); // O(n log n)
    const trips = assignPackagesToDrones(drones, locations); // O(n^2)
    console.log(trips);
}

function getDroneNames(firstInputLine){
    const parts = firstInputLine.split(',').map(part => part.trim());
    const drones = [];
    for (let i = 0; i < parts.length; i += 2) {
        const droneName = parts[i].replace('[', '').replace(']', '');
        const capacity = parseInt(parts[i + 1].replace('[', '').replace(']', ''));
        drones.push({ name: droneName, capacity: capacity });
    }
    
    return drones;
}

function getLocations(linesLocations){
    const locations = linesLocations.map(line => {
        const [name, weight] = line.split(',').map(item => item.trim().replace('[', '').replace(']', ''));
        return { name, weight: parseInt(weight) };
      });
    return locations;
}

function orderLocationsByWeight(locations){
    return locations.sort((a, b) => b.weight - a.weight);
}

function orderDronesByCapacity(drones){
    return drones.sort((a, b) => b.capacity - a.capacity);
}



function assignPackagesToDrones(drones, locations) {
    const trips = initializeTrips(drones); //O(n)
    while (locations.length > 0) {
        const locationsAssignedThisRound = assignLocationsToDrones(drones, locations, trips);
        if (locationsAssignedThisRound === 0) break;
    }
    return trips;
}

function initializeTrips(drones) {
    const trips = {};
    drones.forEach(dron => trips[dron.name] = []);
    return trips;
}

function assignLocationsToDrones(drones, locations, trips) {
    let locationsAssigned = 0;
    drones.forEach(dron => {
        const { trip } = calculateTripForDron(dron, locations);
        if (trip.length > 0) {
            trips[dron.name].push(trip);
            locationsAssigned += trip.length;
        }
    });

    return locationsAssigned;
}

function calculateTripForDron(dron, locations) {
    let dronCapacity = dron.capacity;
    let trip = [];

    for (let i = 0; i < locations.length; i++) {
        if (locations[i].weight <= dronCapacity) {
            trip.push(locations[i].name);
            dronCapacity -= locations[i].weight;
            locations.splice(i, 1);
            i--;
        }
    }
    return { trip };
}



