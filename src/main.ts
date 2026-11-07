import * as d3 from "d3";

export interface ScavItem {
    special: string;
    number: string;
    year: string;
    text: string;
}

const main = (items: ScavItem[]) => {
    console.log(items);
};

const load = () => {
    console.log("Hello");
    d3.select("#app")
        .append("p")
            .text("Loading, please wait...");
    fetch("/all_items.json")
        .then((response) => response.json())
        .then((loaded) => {
            main(loaded as ScavItem[]);
        })
        .catch((error) => console.error("Error loading data:", error));
};

load();
