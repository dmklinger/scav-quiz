import * as d3 from "d3";

export interface ScavItem {
    special: string;
    number: string;
    year: string;
    text: string;
}

let items: ScavItem[];
let sampleSize: number;

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

const selectSampleSize = (n: number) => {
    sampleSize = n;
    d3.select("#start-button")
        .attr("class", "valid")
        .text("Start!");
    d3.selectAll(".sample-size-option.selected")
        .attr("class", "sample-size-option unselected");
    d3.select(`#sample-size-${n}`)
        .attr("class", "sample-size-option selected");
    console.log(`Selected samplesize ${sampleSize}`);
};

const makeIntro = () => {
    d3.select("#content-body")
        .selectAll("*")
        .remove();
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "content-body-intro")
            .text("Can you tell which era Scav items are from? Find out with this scientific* quiz! We give you random items uniformly distributed across the history of Scav and you simply guess which year it's from. Good luck :)");
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "content-body-questionable-footnote")
            .text("*debatably");
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "content-body-select-item-count-description")
            .text("Pick! Your! Sample! Size!");
    d3.select("#content-body")
        .append("div")
            .attr("id", "sample-size-options");
    d3.select("#sample-size-options")
        .append("div")
            .attr("class", "sample-size-option unselected")
            .attr("id", "sample-size-25")
            .text("Small (25)")
            .on("click", (_) => selectSampleSize(25));
    d3.select("#sample-size-options")
        .append("div")
            .attr("class", "sample-size-option unselected")
            .attr("id", "sample-size-50")
            .text("Medium (50)")
            .on("click", (_) => selectSampleSize(50));
    d3.select("#sample-size-options")
        .append("div")
            .attr("class", "sample-size-option unselected")
            .attr("id", "sample-size-100")
            .text("Large (100)")
            .on("click", (_) => selectSampleSize(100));
    d3.select("#content-body")
        .append("div")
            .attr("id", "start-button")
            .attr("class", "invalid")
            .text("Select a size to start!");
};

const main = () => {
    makeIntro();
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
            items = loaded as ScavItem[];
            main();
        })
        .catch((error) => console.error("Error loading data:", error));
};

uiFormat();
load();
