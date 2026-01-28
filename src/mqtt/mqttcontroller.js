const mqtt = require("mqtt");
const {ulid} = require("ulid");

// MQTT broker URL
const brokerUrl = process.env.brokerUrl;

const TelemetryService = require("../services/telemetryService");


// Create an MQTT client
const client = mqtt.connect(brokerUrl, {
  username: process.env.BROKERUSERNAME,  
  password: process.env.BROKERPASS  
});

// Topic to subscribe to
const topic = "telemetry/poles";
const publish_topic ='control/poles';

// Handle connection event
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to the topic
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error("Subscription error:", err);
    }
  });

  // Publish a test message
  // const testData = {
  //   pole_id: "mqtt_pole",
  //   ts: new Date(),
  //   state: "active",
  //   voltage: 230.0,
  //   current_a: 5.0,
  //   power_w: 1150.0,
  //   energy_kwh: 1.5,
  //   ambient_lux: 300.0,
  //   temperature_c: 25.0,
  //   dimming_level: 80,
  //   fault_code: null,
  // };
  //const testData2 = {"pole_id":"1","command":"OFF"}

  
  // client.publish(publish_topic, JSON.stringify(testData2), { qos: 1 }, (err) => {
  //   if (err) {
  //     console.error("Publish error:", err);
  //   } else {
  //     console.log("Message published successfully to topic:", publish_topic);
  //   }
  // });
});

// Handle incoming messages
client.on("message", (topic, message) => {
  // message is a Buffer
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  TelemetryService.recordTelemetry({
    telemetry_id: ulid(),
    pole_id: "1",
    ts: new Date(),
    state: "active",
    voltage: 230.0,
    current_a: 5.0,
    power_w: 1150.0,
    energy_kwh: 1.5,
    ambient_lux: 300.0,
    temperature_c: 25.0,
    dimming_level: 80,
    fault_code: null,
  })
    .then((recorded) => {
      console.log("Telemetry recorded:", recorded);
    })
    .catch((error) => {
      console.error("Error recording telemetry:", error);
    });
});

// Handle error event
client.on("error", (err) => {
  console.error("MQTT Client Error:", err);
});

// Handle close event
client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});
//client.publish('telemetry/pole', 'Hello');

module.exports = client;
