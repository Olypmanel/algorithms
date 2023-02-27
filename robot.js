const roads = [
    "Post Office-Alice's House-2km", "Post Office-Marketplace-5km", "Alice's House-Cabin-6km",
    "Alice's House-Bob's House-2.8km", "Marketplace-Farm-100km","Marketplace-Shop-10km",
    "Marketplace-Townhall-17km", "Townhall-Bob's House-1km", "Townhall-Darie's House-6km",
    "Darie's House-Edie's House-3.5km", "Edie's House-Grete's House-1.5km"
    ,"Grete's House-Shop-3.2km","Grete's House-Farm-500km", "Shop-Townhall-2km"
];
function cityEdges(roads) {
    const edges = Object.create(null);
    function addEdges (from, to, dis,unit){
        if (!edges[from]) edges[from] = { [to]: [+dis, unit] };
        else edges[from][to] = [+dis, unit];
    }
    for ( const road of roads) {
      const [_,from, to, dis, unit] = road.match(/^(['\s\w]+)-(['\s\w]+)-?([\.\d]+)?(\w*?)$/);
       addEdges(from, to, dis??0, unit);
       addEdges(to, from, dis??0, unit);
    }
    return edges;
}
const roadGraph = cityEdges(roads);
const random = arr => arr[(Math.random()*arr.length)>>0];
class CityState {
    constructor(location, parcels) {
        this.location = location;
        this.parcels = parcels;
    } 
    move(destination) {
        if (!(destination in roadGraph[this.location])) 
            throw new Error("NO POSSIBLE ROUTE TO FOLLOW");
        else {
            const parcels =  this.parcels.map(p => 
               p.location === this.location 
                 ? {location: destination, address: p.address} 
                 : p
            ).filter(p => p.location !== p.address);
            return new CityState(destination, parcels);
        }
    }
    static generateParcel(parcelCount = 6) {
        const parcels = [];
        for (let i = parcelCount; i > 0; i--) {
           const location = random(Object.keys(roadGraph));
           let address;
           do {
               address = random(Object.keys(roadGraph));
           } while (address === location);
           parcels.push({location, address});
       }
       let fake //= [{location: "Farm", address: "Post Office"}, {location:"Darie's House", address: "Cabin"}]
       return new CityState("Post Office",fake || parcels);
    }
}
const randomRob = ({location})=>({destination: random(Object.keys(roadGraph[location]))});

function pathFinder (curRobLoc, possibleDest, graph){
    const queue = [{at:curRobLoc, route: []}];
    for (let i = 0; ;i++) {
        const {at, route} = queue[i];
        for (const place in graph[at]) {
            if (possibleDest.has(place)) 
                return route.concat(place);
            if (queue.every(q => q.at !== place))
                queue.push({at: place, route: route.concat(place)});
        }
    }
}
function dikstra(curRobLoc,possibleDest,graph) {
    const queue = [{at:curRobLoc, route:[curRobLoc]}];
    const allRoutes = [];
    for (const role of queue) {
        //if (!queue[i]) break;
        //if (i === 1000) break;
        let {at, route} = role;
        for (const place in graph[at]) {
            if (possibleDest.has(place)) 
                allRoutes.push(route.concat(place));
            if (queue.every(q => q.at !== place))
            queue.push({at: place, route: route.concat(place)});
        }
    }
        const red = arr => {
            let num = 0;
            for (let i = 0; i < arr.length - 1;i++)
                num += graph[arr[i]][arr[i+1]][0];
            return num;
        };
        return allRoutes.reduce((i, r) => red(i) < red(r) ? i : r).slice(1);
    
}
function efficientRob(state,pathFind, memory=[]) {
    if (memory.length === 0 ) {
        const points = new Set();
        const {parcels, location} = state;
        parcels.every(p => p.location === location)
         ? parcels.forEach(p =>  points.add(p.address))
         : parcels.forEach(p => p.location !== location && points.add(p.location));
        memory = pathFind(location, points,roadGraph);
    }
    return {destination: memory[0], memory: memory.slice(1)};
}
function runRobot(state,robot,finder, memory) {
    let distance  = 0;
    for (let turn = 0; ;turn++) {
        let {parcels, location} = state;
        if (parcels.length === 0) {
           console.log(`Done in ${turn} turns and ${distance} kilometers
           
           `);
           return [turn, +distance.toFixed(2)];
        }
        const action = robot(state, finder, memory); // => {destination, memory}
        state = state.move(action.destination);
        distance += roadGraph[location][action.destination][0];
        memory = action.memory;
        console.log(`${location} to ${action.destination}`);
    }
}
const parcels = CityState.generateParcel(100);
const path = runRobot(parcels, efficientRob, pathFinder);
const dik = runRobot(parcels, efficientRob, dikstra);
console.log({path, dik});
