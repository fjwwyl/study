import {get} from "lodash"

const test = {
    a: "aa",
    b: "bb"
}
export const foo = () => {

    console.log(get(test, a, ""))
}