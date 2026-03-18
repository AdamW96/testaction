const { db } = require('../db')

const rand = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(1));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function mockAzure() {

  return {
    provider: 'Azure', status: 'healthy', region: 'us-east-1',
    cpu_usage: rand(40, 85), memory_usage: rand(45, 75),
    cost_usd: rand(4500, 5800), alerts: randInt(0, 5),
    resources: { ec2: { running: 20, stopped: 5 }, s3_buckets: 14 },
  };
}

function mockAWS() {

  return {
    provider: 'AWS', status: 'healthy', region: 'us-east-1',
    cpu_usage: rand(40, 85), memory_usage: rand(45, 75),
    cost_usd: rand(4500, 5800), alerts: randInt(0, 5),
    resources: { ec2: { running: 20, stopped: 5 }, s3_buckets: 14 },
  };
}

function mockGCP() {

  return {
    provider: 'GCP', status: 'healthy', region: 'us-east-1',
    cpu_usage: rand(40, 85), memory_usage: rand(45, 75),
    cost_usd: rand(4500, 5800), alerts: randInt(0, 5),
    resources: { ec2: { running: 20, stopped: 5 }, s3_buckets: 14 },
  };
}

function getAllProviders() {
  const data = [mockAzure(), mockAWS(), mockGCP()];
  const stmt = db.prepare(
    'INSERT INTO metrics_history (provider, cpu_usage, memory_usage, cost_usd) VALUES (?, ?, ?, ?)'
  );
  data.forEach(d => stmt.run(d.provider, d.cpu_usage, d.memory_usage, d.cost_usd));
  return data;
}

function getProvider(name) {
    return {azure: mockAzure, aws: mockAWS, gcp: mockGCP} [name.toLowerCase()]?.() ?? null;
}

function getTimeseries(provider) {
  const rows = db.prepare(
    `SELECT cpu_usage, memory_usage, recorded_at as time
     FROM metrics_history WHERE provider = ?
     ORDER BY recorded_at ASC LIMIT 50`
  ).all(provider);

  if (rows.length < 3) {
    return Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      cpu_usage: rand(30, 80), memory_usage: rand(40, 75),
    }));
  }
  return rows;
}

module.exports = { getAllProviders, getProvider, getTimeseries };