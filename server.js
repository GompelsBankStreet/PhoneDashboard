const express = require("express");

const connection = require('./connection');

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const COLUMNS = [
  "queue_stats_id",
  "uniqueid",
  "datetime",
  "info1",
  "info2",
  "info3",
  "info4",
  "info5",
  "event",
  "agent",
  "queue"
];
app.get("/api/stats", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startTime = '00:00:00';
  const endTime = '23:59:59';

  if (!startDate) {
    res.json({
      error: "Missing required parameter `startDate`"
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.

  const q = `select ${COLUMNS.join(", ")} from  queue_stats_full a WHERE (a.datetime >= '${startDate} ${startTime}' AND a.datetime < '${endDate} ${endTime}') AND a.uniqueid IN (SELECT uniqueid FROM queue_stats_full WHERE queue IN (802,8011) AND (datetime >= '${startDate} ${startTime}' AND datetime < '${endDate} ${endTime}')) ORDER BY a.uniqueid, a.datetime asc` ;

  conn.query(q, (err, r) => {
    if (err) {
      res.redirect('/');
    }

    res.json(r);

    return;
  });
});


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
