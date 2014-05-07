var format = require('util').format;
var backlogApi = require('backlog-api');

var allActivities = {}; // key: updated_on, value: activity
setInterval(function() {
  var backlog = backlogApi();

  backlog.getTimeline()
  .then(function(activities) {
    activities.reverse().forEach(function(activity) {
      if (!allActivities[activity.updated_on]) {
        var msg = [
          activity.updated_on,
          activity.issue.key,
          activity.content.replace(/\n/g, '').substring(0, 20),
        ].join(' ');
        console.log(msg);
      }
      allActivities[activity.updated_on] = activity;
    });
  })
  .catch(function(err) {
    console.error(err);
  });

}, 10 * 1000);

