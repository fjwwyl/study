enum Base {
    BAD
}

let a: Base = Base.BAD;


let b: any = "123";
let c: string = b;

console.log(a, b, c);