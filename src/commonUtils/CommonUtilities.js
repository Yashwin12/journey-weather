export function containsKey(keyToFind, objectArray) {
    for (var i = 0; i < objectArray.length; i++) {
      if (objectArray[i].key === keyToFind) {
        return true;
      }
    }
    return false;
  }