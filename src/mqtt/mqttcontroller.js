const mqtt = require("mqtt");

// MQTT broker URL
const brokerUrl = "653aff43ed7c4222954bebef306b9a90.s1.eu.hivemq.cloud";

const TelemetryService = require("./services/telemetryService");

// Create an MQTT client
const client = mqtt.connect(brokerUrl);

// Topic to subscribe to
const topic = "test/topic";

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
});

// Handle incoming messages
client.on("message", (topic, message) => {
  // message is a Buffer
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  TelemetryService.recordTelemetry({
    telemetry_id: null,
    pole_id: "mqtt_pole",
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

module.exports = client;
