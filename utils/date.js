function currentTimeStamp() {
    const d = new Date();
    const dateString = `${d.getFullYear()}-${pad00(d.getMonth())}-${pad00(d.getDate())} ${pad00(d.getHours())}:${pad00(d.getMinutes())}:${pad00(d.getSeconds())}`;
    return dateString;
}

function pad00(number) {
    return number.toString().padStart(2, '0')
}

module.exports = {
    currentTimeStamp
}