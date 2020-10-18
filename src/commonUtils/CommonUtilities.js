export function containsKey(keyToFind, objectArray) {
    for (var i = 0; i < objectArray.length; i++) {
      if (objectArray[i].key === keyToFind) {
        return true;
      }
    }
    return false;
}

export function formatTime_unixToHHMM(unixTime) {
  var date = new Date(unixTime * 1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();

  var formattedDate = date.toISOString().substr(5,5);
  return `${formattedDate} ~ ${hours}:${minutes}`;
}