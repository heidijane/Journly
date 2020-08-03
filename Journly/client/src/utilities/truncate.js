/*
    truncates.js
    Utility that trims a string down to a certain number of characters
    Will not trim in the middle of a word
    Removes any trailing punctuation at the end of the string
*/

export const truncate = (string, maxLength) => {
    if (string.length > maxLength) {
        const truncatedString = string.substr(0, maxLength);
        if (truncatedString.charAt(maxLength) === " ") {
            return truncatedString.replace(/([.,\/#!$%\^&\*;:{}=\-_`~()\]\[])+$/g, "") + '...';
        } else {
            return truncatedString.substr(0, truncatedString.lastIndexOf(" ")).replace(/([.,\/#!$%\^&\*;:{}=\-_`~()\]\[])+$/g, "") + '...';
        }
    } else {
        return string;
    }
}