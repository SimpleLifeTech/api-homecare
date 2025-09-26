import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const options = {
  url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  compression: CompressionAlgorithm.GZIP,
};
const metricExporter = new OTLPMetricExporter(options);

const traceExporter = new OTLPTraceExporter(options);

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  // exporter: new ConsoleMetricExporter(),
  exportIntervalMillis: Number(process.env.OTEL_METRIC_EXPORT_INTERVAL) || 15000,
  exportTimeoutMillis: Number(process.env.OTEL_METRIC_EXPORT_TIMEOUT) || 5000,
});

const sdk = new NodeSDK({
  metricReader,
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations({}), new ExpressInstrumentation({})],
});

process.on("beforeExit", async () => {
  await sdk.shutdown();
});

sdk.start();

export {};
