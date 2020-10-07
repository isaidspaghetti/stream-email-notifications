var express = require("express");
var router = express.Router();
const stream = require("getstream");
const multer = require("multer");

const upload = multer();

require("dotenv").config();

const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const appId = process.env.STREAM_APP_ID;

const client = stream.connect(streamApiKey, streamApiSecret);

router.get("/registration", async (req, res) => {
  try {
    await client.user("example-user").getOrCreate({
      name: "example-user",
    });

    await client.user("sendGrid").getOrCreate({
      name: "sendGrid",
    });

    const userFeed = client.feed("notification", "example-user");

    await userFeed.follow("email_notifications", "sendGrid");

    const userToken = client.createUserToken("example-user");

    res.status(200).json({
      userToken,
      streamApiKey,
      appId,
    });

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/sendgrid-webhook-endpoint", upload.none(), async function (
  req,
  res
) {
  try {
    let actor;
    let verb;
    let object;
    let body;

    if (req.body.text.includes("youtube")) {
      actor = "youtube";
      verb = "comment";
      object = req.body.text.match(
        /https:\/\/www\.youtube\.com\/attribution_link.*comments/gim
      );
      body = req.body.text
        .match(/\n.*\nReply/gim)
        .toString()
        .replace("Reply", "", /(\r\n |\n |\r)/gm, "");
    } else if (req.body.subject.includes("Twitter")) {
      actor = "twitter";
      verb = "message";
      object = req.body.text
        .match(/https.*>/i)
        .toString()
        .replace(">", "");
      body = req.body.text
        .match(/To:.*\n\n\n.*/gim)
        .toString()
        .replace(/To:.*\n\n\n/gim, "");
    } else {
      actor = "sendGrid";
      verb = "email";
      object = "link-to-your-mail-account";
      body = req.body.text;
    }

    const sendGrid = client.feed("email_notifications", "sendGrid");

    await sendGrid.addActivity({
      actor: actor,
      verb: verb,
      object: object,
      subject: req.body.subject,
      recipient: req.body.to,
      body: body,
      sender: req.body.from,
    });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
