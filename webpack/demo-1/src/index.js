const name = "fjw"
import {foo} from "./demo";
import css from "./index.css"
import md from "./test.md"
import {set} from "lodash"

const test = {
    a: "aa",
    b: "bb"
}
export const fooo = () => {
    set(test, "c", "cc");
    console.log(get(test, c, ""))
}
console.log(css)
console.log(md)
const sayHello = () => {
    console.log("hello " + name);
    return () => {
        console.log(foo())
    }
}

sayHello();
const render = () => {


    let div = document.createElement("div");
    div.innerHTML = md;
    document.body.appendChild(div)
}

render();


import ("./asyncModule").then((module) => {
    module.foo();
})
