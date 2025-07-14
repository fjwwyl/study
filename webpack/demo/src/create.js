

export default () => {
    const element = document.createElement("h1");

    element.textContent = "fjw";
    element.addEventListener("click", () => {
        console.log("fjw");
    })
    return element;
};


