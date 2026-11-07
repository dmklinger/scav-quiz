import * as d3 from "d3";

export interface ScavItem {
    special: string;
    number: string;
    year: string;
    text: string;
}

const uiFormat = () => {
    d3.select("#app")
        .append("div")
            .attr("id", "content-header")
        .append("div")
            .attr("class", "text")
            .attr("id", "content-header-title")
            .text("Scav History Quiz!!!");
    d3.select("#app")
        .append("div")
            .attr("id", "content-body");
};

const main = (items: ScavItem[]) => {
    console.log(items);
};

const load = () => {
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "loading-message")
            .text("Loading, please wait...");
    fetch("/all_items.json")
        .then((response) => response.json())
        .then((loaded) => {
            main(loaded as ScavItem[]);
        })
        .catch((error) => console.error("Error loading data:", error));
};

uiFormat();
load();
