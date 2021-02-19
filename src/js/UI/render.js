UI.renderAreaTitle = function(area) {
  return area.title;
}

UI.renderElement = function(element, content) {
  if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else {
    element.innerHTML = content;
  }
}
