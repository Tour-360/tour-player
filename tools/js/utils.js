arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr; // for testing
}

const path = {
  resolve: function() {
    return [
      parent.location.origin,
      parent.location.pathname,
      [...arguments].join('/')
    ].join('');
  }
}
