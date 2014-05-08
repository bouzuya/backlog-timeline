var moment = require('moment');
var backlogApi = require('backlog-api');

var parseTags = function(s) {
  var tags = [];
  var re = new RegExp('\s*\\[ ([^:]+):\s*(.*?) \\]\s*', 'g');
  var match = re.exec(s);
  while (match) {
    tags.push({ name: match[1], value: match[2] });
    match = re.exec(s);
  }
  return tags;
};

var parseContent = function(content) {
  return { tags: parseTags(content), content: content };
};

var formatActivity = function(activity) {
  var content = parseContent(activity.content);
  var msg = [
    moment(activity.updated_on, 'YYYYMMDDHHmmss').format(),
    activity.user.name,
    activity.issue.key,
    content.tags.map(function(tag) {
      return tag.name + '=' + tag.value;
    }).join(','),
    content.content.replace(/\n/g, '').substring(0, 20),
  ].join(' ');
  return msg;
};

var allActivities = {}; // key: updated_on, value: activity
setInterval(function() {
  var backlog = backlogApi();

  backlog.getTimeline()
  .then(function(activities) {
    activities.reverse().forEach(function(activity) {
      if (!allActivities[activity.updated_on]) {
        allActivities[activity.updated_on] = activity;
        console.log(formatActivity(activity));
      }
    });
  })
  .catch(function(err) {
    console.error(err);
  });
}, 10 * 1000);

