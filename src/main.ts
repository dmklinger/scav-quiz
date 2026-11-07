import * as d3 from "d3";

export interface ScavItem {
    special: string;
    number: string;
    year: number;
    text: string;
}

let items: Record<string, ScavItem[]>;
const quizItems: ScavItem[] = [];
const guesses: number[] = [];
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
};

const makeResultsPage = () => {
    d3.select("#content-body")
        .selectAll("*")
        .remove();

    let exactlyRight = 0;
    let aboutRight = 0;
    const errors = [];
    let sumErrors = 0;

    for (let i = 0; i < sampleSize; i++) {
        const quizItem = quizItems[i];
        const guess = guesses[i];
        const error = Math.abs(quizItem.year - guess);
        errors.push(error);
        sumErrors += error;
        if (error == 0) exactlyRight += 1;
        if (error <= 2.5) aboutRight += 1;
    }

    const meanError = sumErrors / sampleSize;
    let sumOfDeviation = 0;
    for (const error of errors) {
        sumOfDeviation += error ** 2;
    }
    const stdDeviation = (sumOfDeviation / sampleSize) ** 0.5;

    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "exact-results")
            .text(`You got ${exactlyRight} / ${sampleSize} exactly right!`);
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "approximate-results")
            .text(`You got ${aboutRight} / ${sampleSize} roughly* right!`);
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "mean-and-std-deviation")
            .text(`You had an average error of ${meanError.toFixed(2)} years with a standard deviation of ${stdDeviation.toFixed(2)} years!`);
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "content-body-questionable-footnote")
            .text("*within a five year period centered on the correct year");
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "results-by-item-header")
            .text("Results by item:");

    for (let i = 0; i < sampleSize; i++) {
        const quizItem = quizItems[i];
        const guess = guesses[i];
        const error = Math.abs(quizItem.year - guess);
        d3.select("#content-body")
            .append("div")
                .attr("class", "text item-detail-item")
                .text(`${quizItem.year}.${quizItem.special}${quizItem.number}: ${quizItem.text}`);
        d3.select("#content-body")
            .append("div")
                .attr("class", "text item-detail-guess")
                .text(`You guessed ${guess}, with an error of ${error} years`);
    }

    d3.select("#content-body")
        .append("div")
            .attr("id", "again-button")
            .attr("class", "invalid")
            .text("Again!")
            .on("click", (_) => {
                makeIntro();
            });
};

const makeQuizPage = (i: number) => {
    d3.select("#content-body")
        .selectAll("*")
        .remove();
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "item-intro")
            .text(`Item-to-Guess #${i + 1} (of ${sampleSize})`);
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "item-text")
            .text(quizItems[i].text);
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "guess-text")
            .text("Your guess...")
        .append("select")
            .attr("id", "year-selector")
        .append("option")
            .attr("value", "")
            .text("-- Pick a year! --");
    // not canonical but whatever
    for (const year of Object.keys(items)) {
        d3.select("#year-selector")
            .append("option")
            .attr("value", year)
            .text(year);
    }
    d3.select("#year-selector").on("change", (_) => {
        if ((d3.select("#year-selector").node() as HTMLInputElement)?.value !== "") {
            if (i + 1 < sampleSize) {
                d3.select("#continue-button")
                    .attr("class", "valid")
                    .text("Continue!");
            } else {
                d3.select("#continue-button")
                    .attr("class", "valid")
                    .text("Results!");
            }
        } else {
            d3.select("#continue-button")
                .attr("class", "invalid")
                .text("Pick a year to continue");
        }
    });
    d3.select("#content-body")
        .append("div")
            .attr("id", "continue-button")
            .attr("class", "invalid")
            .text("Pick a year to continue")
            .on("click", (_) => {
                if (d3.select("#continue-button").classed("valid")) {
                    const selection = Number(
                        (d3.select("#year-selector").node() as HTMLInputElement)?.value,
                    );
                    guesses.push(selection);
                    if (i + 1 < sampleSize) {
                        makeQuizPage(i + 1);
                    } else {
                        makeResultsPage();
                    }
                }
            });
};

const startQuiz = () => {
    while (quizItems.length) quizItems.pop();
    while (guesses.length) guesses.pop();
    const years = Object.keys(items);
    const selections: string[][] = [];
    for (let i = 0; i < sampleSize; i++) {
        let selectedYear: string;
        let selectedItem: number;
        do {
            selectedYear = years[Math.floor(Math.random() * (years.length - 1))];
            selectedItem = Math.floor(Math.random() * (items[selectedYear].length));
        } while (selections.some(prevSelection => 
            selectedYear === prevSelection[0] && String(selectedItem) === prevSelection[1],
        ) 
            || items[selectedYear][selectedItem].text.toUpperCase().includes("TBA") 
            || (
                items[selectedYear][selectedItem].text.toUpperCase().includes("A copy of the")
                && items[selectedYear][selectedItem].text.toUpperCase().includes("University of Chicago Scavenger Hunt List")
            )
        );
        selections.push([selectedYear, String(selectedItem)]);
        quizItems.push(items[selectedYear][selectedItem]);
    }
    makeQuizPage(0);
};

const makeIntro = () => {
    d3.select("#content-body")
        .selectAll("*")
        .remove();
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "content-body-intro")
            .text("Can you tell different Scav item writing eras apart? Find out with this scientific* quiz! We give you random items uniformly distributed across the history of Scav and you simply guess which year it's from. Good luck :)");
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
            .attr("id", "sample-size-10")
            .text("Small (10)")
            .on("click", (_) => selectSampleSize(10));
    d3.select("#sample-size-options")
        .append("div")
            .attr("class", "sample-size-option unselected")
            .attr("id", "sample-size-25")
            .text("Medium (25)")
            .on("click", (_) => selectSampleSize(25));
    d3.select("#sample-size-options")
        .append("div")
            .attr("class", "sample-size-option unselected")
            .attr("id", "sample-size-50")
            .text("Large (50)")
            .on("click", (_) => selectSampleSize(50));
    d3.select("#content-body")
        .append("div")
            .attr("id", "start-button")
            .attr("class", "invalid")
            .text("Select a size to start!")
            .on("click", (_) => {
                if (d3.select("#start-button").classed("valid"))
                    startQuiz();
            });
};

const load = () => {
    d3.select("#content-body")
        .append("div")
            .attr("class", "text")
            .attr("id", "loading-message")
            .text("Loading, please wait...");
    fetch("all_items.json")
        .then((response) => response.json())
        .then((loaded) => {
            items = loaded as Record<number, ScavItem[]>;
            makeIntro();
        })
        .catch((error) => {
            console.error("Error loading data:", error);
            d3.select("#loading-message")
                .text("Something went horribly wrong :(");
        });
};

uiFormat();
load();
