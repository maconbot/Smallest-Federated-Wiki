// Generated by CoffeeScript 1.4.0
(function() {
  var bind, emit, find, format, parse;

  parse = function(text) {
    var line, program, words, _i, _len, _ref;
    program = {};
    _ref = text.split(/\n/);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      words = line.match(/\S+/g);
      if (words[0] === 'FIND') {
        program.find = words.slice(1, 1000).join(' ');
      } else if (words[0] === 'APPLY') {
        program.apply = words.slice(1, 1000).join(' ');
      } else if (words[0] === 'SLIDE') {
        program.slide = true;
      } else {
        program.error = {
          line: line,
          message: "can't make sense of line"
        };
      }
    }
    return program;
  };

  find = function(program, page) {
    var item, link, links, parsing, titles, _i, _j, _len, _len1, _ref;
    titles = [];
    if (program.find) {
      _ref = page.story;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.type === 'pagefold') {
          parsing = item.text === program.find;
        } else if (parsing && item.type === 'paragraph') {
          if (links = item.text.match(/\[\[.*?\]\]/g)) {
            for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
              link = links[_j];
              titles.push(link.substr(2, link.length - 4));
            }
          }
        }
      }
    }
    return titles;
  };

  format = function(program, titles) {
    var rows, title, _i, _len;
    rows = [];
    if (program.error) {
      rows.push("<tr><td><p class=\"error\">" + program.error.line + " <span title=\"" + program.error.message + "\">*");
    }
    for (_i = 0, _len = titles.length; _i < _len; _i++) {
      title = titles[_i];
      rows.push("<tr><td>" + title + "<td>50%");
    }
    return rows.join("\n");
  };

  emit = function($item, item) {
    var page, program, slider, titles;
    program = parse(item.text);
    page = $item.parents('.page').data('data');
    titles = find(program, page);
    $item.append("<table style=\"width:100%; background:#eee; padding:.8em; margin-bottom:5px;\">\n  " + (format(program, titles)) + "\n</table>");
    $item.append((slider = $('<div />')));
    if (program.slide) {
      return slider.slider({
        animate: 'fast',
        value: 50,
        slide: function(event, ui) {
          return $item.find('td:last').text("" + ui.value + "%");
        }
      });
    }
  };

  bind = function($item, item) {
    return $item.dblclick(function() {
      return wiki.textEditor($item, item);
    });
  };

  window.plugins.reduce = {
    emit: emit,
    bind: bind
  };

}).call(this);
