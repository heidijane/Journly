//trim length of string to a certain number of words
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