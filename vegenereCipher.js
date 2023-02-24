const generateTable = (alpha) => {
    let letters = alpha;
    const TABLE = new Map()
    for (let i = 0; i < alpha.length; i++) {
        const index = alpha.indexOf(alpha[i]);
        letters = alpha.slice(index) + alpha.slice(0, index);
        TABLE.set(alpha[i], letters)
    }
    return TABLE
}
class VigenèreCipher {
    constructor (key, alpha) {
        this.key = function(str) {
            let newkey = ""
            for (let i=0; i < str.length;i++) newkey += key[i % key.length]
            return newkey;
        }
        this.alpha = alpha;
        this.table = generateTable(alpha);
    }
    encode(str) {
        let answer = "";
        for (let i = 0; i<str.length; i++) {
          answer+= this.alpha.includes(str[i]) 
          ? this.table.get(this.key(str)[i])[this.alpha.indexOf(str[i])]
          : str[i];
          
        }
        return answer;
    }
    decode(str) {
        let answer = "";
        for (let i = 0; i < str.length; i++) {
        answer += this.table.get(this.key(str)[i]).includes(str[i])
        ? this.alpha[this.table.get(this.key(str)[i]).indexOf(str[i])]
        : str[i];
        }
        return answer;
    }
}