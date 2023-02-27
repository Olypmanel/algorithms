const formatDuration = (SS, setState) => {
    const OBJ = {decade : 315360000, year: 31536000, day: 86400, hour: 3600, minute: 60, second: 1};
    const TIME = [];
    for(let elem in OBJ) {
        let count = 0;
        if (SS >= OBJ[elem]) {
            while (SS >= OBJ[elem]) {
                count++;
                SS -= OBJ[elem];
                SS < OBJ[elem] && TIME.push([count,elem]);
            }
        }
    }
   const display =(t, d) => {
       const index = d.indexOf(t);
       const length = d.length;
       return `${index === length - 1&&length > 1 ? "and ":''}${t[0]} ${t[0] > 1 ? t[1] +'s': t[1]}${index!==length - 1&& index!==length - 2 ?',':''}`;
   };
  // setState(TIME.map(time => display(time, TIME)).join` `);
   return TIME.map(time => display(time, TIME)).join` `;
};
console.log(formatDuration(86402));
const {seven,times,nine} = require('./arithFuncs.js');
console.log(seven(times(nine())));
