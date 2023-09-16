// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// import * as d3 from "d3";
// Search the bookmarks when entering the search keyword.
$('#search').change(function () {
  $('#bookmarks').empty();
  dumpBookmarks($('#search').val());
});

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  const bookmarkTreeNodes = chrome.bookmarks.getTree(function (
    bookmarkTreeNodes
  ) {
    $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
  });
  console.log("success");
}

function dumpTreeNodes(bookmarkNodes, query) {
  const list = $('<ul>');
  for (let i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }

  return list;
}

function dumpNode(bookmarkNode, query) {
  let span = '';
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (
        String(bookmarkNode.title.toLowerCase()).indexOf(query.toLowerCase()) ==
        -1
      ) {
        return $('<span></span>');
      }
    }

    const anchor = $('<a>');
    anchor.addClass('button');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);

    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function () {
      chrome.tabs.create({ url: bookmarkNode.url });
    });

    span = $('<span>');
    const options = bookmarkNode.children
      ? $('<span>[<a href="#" id="addlink">Add</a>]</span>')
      : $(
          '<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
            'href="#">Delete</a>]</span>'
        );
    const edit = bookmarkNode.children
      ? $(
          '<table><tr><td>Name</td><td>' +
            '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
            '</td></tr></table>'
        )
      : $('<input>');

    // Show add and edit links when hover over.
    span
      .hover(
        function () {
          span.append(options);
          $('#deletelink').click(function (event) {
            console.log(event);
            $('#deletedialog')
              .empty()
              .dialog({
                autoOpen: false,
                closeOnEscape: true,
                title: 'Confirm Deletion',
                modal: true,
                show: 'slide',
                position: {
                  my: 'left',
                  at: 'center',
                  of: event.target.parentElement.parentElement
                },
                buttons: {
                  'Yes, Delete It!': function () {
                    chrome.bookmarks.remove(String(bookmarkNode.id));
                    span.parent().remove();
                    $(this).dialog('destroy');
                  },
                  Cancel: function () {
                    $(this).dialog('destroy');
                  }
                }
              })
              .dialog('open');
          });
          $('#addlink').click(function (event) {
            edit.show();
            $('#adddialog')
              .empty()
              .append(edit)
              .dialog({
                autoOpen: false,
                closeOnEscape: true,
                title: 'Add New Bookmark',
                modal: true,
                show: 'slide',
                position: {
                  my: 'left',
                  at: 'center',
                  of: event.target.parentElement.parentElement
                },
                buttons: {
                  Add: function () {
                    edit.hide();
                    chrome.bookmarks.create({
                      parentId: bookmarkNode.id,
                      title: $('#title').val(),
                      url: $('#url').val()
                    });
                    $('#bookmarks').empty();
                    $(this).dialog('destroy');
                    window.dumpBookmarks();
                  },
                  Cancel: function () {
                    edit.hide();
                    $(this).dialog('destroy');
                  }
                }
              })
              .dialog('open');
          });
          $('#editlink').click(function (event) {
            edit.show();
            edit.val(anchor.text());
            $('#editdialog')
              .empty()
              .append(edit)
              .dialog({
                autoOpen: false,
                closeOnEscape: true,
                title: 'Edit Title',
                modal: true,
                show: 'fade',
                position: {
                  my: 'left',
                  at: 'center',
                  of: event.target.parentElement.parentElement
                },
                buttons: {
                  Save: function () {
                    edit.hide();
                    chrome.bookmarks.update(String(bookmarkNode.id), {
                      title: edit.val()
                    });
                    anchor.text(edit.val());
                    options.show();
                    $(this).dialog('destroy');
                  },
                  Cancel: function () {
                    edit.hide();
                    $(this).dialog('destroy');
                  }
                }
              })
              .dialog('open');
          });
          options.fadeIn();
        },

        // unhover
        function () {
          options.remove();
        }
      )
      .append(anchor);
  }

  const li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }

  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});


chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
  bookmarkTreeNodes.forEach(
    (a) => {
      document.addEventListener('keypress', function () {
        // Specify the chart’s dimensions.
        const width = 928;
        const height = 600;

        // Compute the graph and start the force simulation.
        const root = d3.hierarchy(a);
        const links = root.links();
        const nodes = root.descendants();

        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
          .force("charge", d3.forceManyBody().strength(-50))
          .force("x", d3.forceX())
          .force("y", d3.forceY());

        // Create the container SVG.
        const svg = d3.create("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto;");

        // Append links.
        const link = svg.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .join("line");

        // Append nodes.
        const node = svg.append("g")
          .attr("fill", "#fff")
          .attr("stroke", "#000")
          .attr("stroke-width", 1.5)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("fill", d => d.children ? null : "#000")
          .attr("stroke", d => d.children ? null : "#fff")
          .attr("r", 3.5)
          // .call(drag(simulation));

        node.append("title")
          .text(d => d.data.title);
          // .text(d => d.data.);

        simulation.on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        });

        // invalidation.then(() => simulation.stop());

        document.getElementById("tree").appendChild(svg.node());
      });
    }
  );
})