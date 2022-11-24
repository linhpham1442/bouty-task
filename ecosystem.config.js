module.exports = {
  apps: [
    {
      name: 'Frontend Bounty Tasks',
      script: '/usr/bin/yarn',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '500M',
    },
  ],
}
