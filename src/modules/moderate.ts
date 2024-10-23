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
    "NDA required",
    "gnarp",
    "ninachat membership",
    "device",
    "nina restaurant",
    "negative wealth",
    "koda",
    "zander",
    "radiohead",
    "fumo",
    "adobe astronaut",
    "piracy",
    "ninacord",
    "devilbro",
    "32gb Trident Z @3200",
    "ultrakill"
];

// WARN: All entries in this array must be regexes. All regexes will have /gu applied to them — manually-specified flags will be ignored!
const bannedWords: RegExp[] = [
    /cunt/,
    /whore/,
    /puss(?:y?|ies?)/,
    /slut/,
    /tit/,
    /cum/,
    /blowjob/,
    /b(?:oo|ew)b.+/,
    /porn/,
    /pron/,
    /pawrn/,
    /r(?:ule)?\s*34/,
    /meo?w\w+/,
    /skibidi/, // 🚽
    /gyat+/,
    /rizzler/,
    /nettspend/,
    /boykisser/,
    /rizz+/,
    /hawk\\s*tuah/,
    /retard/,
    /fag(?:g?ot)?s?/, // hey look it's us - koda and zander
    /n[i\*]g(?:g?[ae])?r?/,
    /grope/,
    /tranny/ // haha also me - zander
];

export function onlyLettersAndNumbers(string: string) {
    return string.match(/^[A-Za-z0-9]*$/);
}

const badWordsRegex = new RegExp(
    "\\b(" + bannedWords.map((regex) => regex.source).join("|") + ")\\b",
    "gi"
);
function replaceBadWords(content: string): string {
    return content.replace(badWordsRegex, function (match) {
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
