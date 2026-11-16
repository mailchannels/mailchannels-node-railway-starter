import http from "node:http";
import { MailChannels } from "@mailchannels/sdk";

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY!);
const PORT = Number(process.env.PORT ?? 3000);

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (pathname === "/api/send" && req.method === "POST") {
    const { data, error } = await mailchannels.emails.send({
      from: "Acme Corporation <acme@example.com>",
      to: "to@example.net",
      subject: "Railway Starter",
      text: "Hello from Railway",
      html: "<p>Hello from Railway</p>"
    });

    if (error) {
      console.error(error);
      res.statusCode = error.statusCode || 500;
      res.end(
        JSON.stringify({
          error: error.message
        })
      );
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        data,
        message: "Email queued successfully."
      })
    );
    return;
  }

  if (pathname === "/health" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: "ok"
      })
    );
    return;
  }

  res.statusCode = 404;
  res.end(
    JSON.stringify({
      error: "Not found"
    })
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Running server on port ${PORT}`);
});
