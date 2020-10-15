export function containsKey(keyToFind, objectArray) {
    for (var i = 0; i < objectArray.length; i++) {
      if (objectArray[i].key === keyToFind) {
        return true;
      }
    }
    return false;
}

export function formatTime_unixToHHMM(unixTime) {
  return new Date(unixTime * 1000).toISOString().match(/(\d{2}:\d{2}:\d{2})/)[1];
}