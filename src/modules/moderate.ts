const badNounsReplacements = [
    "pasta",
    "kebab",
    "cake",
    "potato",
    "woman",
    "computer",
    "java",
    "hamburger",
    "monster truck",
    "osu!",
    "Ukrainian ball in search of gas game",
    "Anime",
    "Anime girl",
    "good",
    "keyboard",
    "NVIDIA RTX 3090 Graphics Card",
    "storm",
    "queen",
    "single",
    "umbrella",
    "mosque",
    "physics",
    "bath",
    "virus",
    "bathroom",
    "mom",
    "owner",
    "airport",
    "Avast Antivirus Free"
];
const bannedWords = [
    "cunt",
    "whore",
    "pussy",
    "slut",
    "tit",
    "cum",
    "blowjob",
    "bewbs",
    "boob",
    "booba",
    "boobies",
    "boobs",
    "booby",
    "porn",
    "pron",
    "r34",
    "mewing", // 🤫🧏🏻‍♂️
    "mew",
    "skibidi", // 🚽
    "gyat",
    "gyatt",
    "rizzler",
    "nettspend",
    "boykisser",
    "rizz",
    "hawk tuah",
    "retard",
    "faggot",
    "fag", // hey look it's me - koda
    "faggots",
    "fags",
    "n*g",
    "n*gg*",
    "n*gg*r",
    "nigga"
];

export const nickRegex = /^[a-z0-9]+$/i;

function replaceBadWords(content: string): string {
    const regex = new RegExp("\\b(" + bannedWords.join("|") + ")\\b", "gi");

    return content.replace(regex, function (match) {
        const randomIndex = Math.floor(Math.random() * badNounsReplacements.length);
        return badNounsReplacements[randomIndex];
    });
}

export function moderateMessage(message: string) {
    return {
        block: false,
        newMessageContent: replaceBadWords(message)
    };
}
