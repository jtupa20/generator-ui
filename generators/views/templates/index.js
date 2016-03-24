module.exports = ui.views({
  <% views.forEach(function(view, index){ %><%= view %>: require('./<%= view %>')<% if (index != views.length-1) { %>,<% } %>
  <% }); %>
  /* end */
});
