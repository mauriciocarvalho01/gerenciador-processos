module.exports = {
  apps: [{
    name: 'dev-gerenciador-processos',
    script: './src/main/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    args: ['--max-memory-restart', '10G'],
    max_restarts: 10,
    restart_delay: 5000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    autorestart: true,
    watch_ignore: ['node_modules', 'logs'],
    cron_restart: '*/30 * * * *',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    watch_options: {
      followSymlinks: false
    },
    ignore: ['node_modules', 'logs'],
    node_args: ['--experimental-specifier-resolution=node', '--optimize_for_size']
  }]
}
