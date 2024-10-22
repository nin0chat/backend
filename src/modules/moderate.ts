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
    "Avast Antivirus Free",
    "buckingham palace",
    "glorp zeep",
    "lithium mines",
    "NDA required"
    "gnarp"
    "ninachat membership"
    "device"
    "nina restaurant"
    "negative wealth"
    "koda"
    "zander"
    "radiohead"
    "fumo"
    "adobe astronaut"
    "piracy"
    "ninacord"
    "devilbro"
    "32gb Trident Z @3200"
    "ultrakill"
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
    "pawrn",
    "r34",
    "rule34",
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
    "fag", // hey look it's us - koda and zander
    "faggots",
    "fags",
    "n*g",
    "n*gg*",
    "n*gg*r",
    "nigga",
    "grope",
    "i'm gonna touch you",
    "im gonna touch you",
    "tranny" // haha also me - zander
];

export function onlyLettersAndNumbers(string: string) {
    return string.match(/^[A-Za-z0-9]*$/);
}

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
