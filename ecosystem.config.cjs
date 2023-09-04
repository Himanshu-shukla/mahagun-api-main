module.exports = {
  apps: [
    {
      name: "mahagun",
      script: "./app.js",
      instances: "max",
      exec_mode: "cluster",
      exp_backoff_restart_delay: 100,
    },
  ],
};
