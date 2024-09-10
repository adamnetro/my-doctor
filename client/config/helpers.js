export const transformName = name => {
    const userName = name.split(' ');
    return userName.map(letter => {
        return letter[0].toUpperCase()
    }).join(" ")
}