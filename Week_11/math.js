function match(selector, element) {
  return true;
}

match("div #id.class", document.getElementById("id"));