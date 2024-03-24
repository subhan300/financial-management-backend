const apn = require("apn");
const sendNotification = (req, res) => {
  const { title, body } = req.body;
  const { deviceId } = req.params;
  console.log(title);
  var options = {
    token: {
      key: "src/AuthKey_B5682YFV8U.p8",
      keyId: "B5682YFV8U",
      teamId: "9R9VKS2PY7"
    },
    production: true
  };

  var apnProvider = new apn.Provider(options);

  let notification = new apn.Notification({
    alert: body,
    title: title,
    sound: "chime.caf",
    mutableContent: 1,
    topic: "xobuya",
    payload: {
      sender: "node-apn"
    }
  });

  apnProvider
    // eslint-disable-next-line max-len
    .send(notification, deviceId)
    .then((result) => {
      console.log("Notification result:", result);
      if (result.failed.length > 0) {
        console.error("Failed notifications:", result.failed);
        res.status(500).send("Failed to send notification");
      } else {
        console.log("Notification sent successfully");
        res.status(200).send("Notification sent successfully");
      }
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).send("Internal server error");
    });
};

module.exports = {
  sendNotification
};
