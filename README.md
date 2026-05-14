# 123.lab115.com

Infrastructure dashboard for lab115. Modern dark-themed landing page with animated background, live clock, service links, and system stats.

## Tech Stack

- HTML5 / CSS3 / Vanilla JS
- Nginx (Docker deployment)
- Hosted on Coolify at `123.lab115.com`

## Deployment

1. Clone this repo
2. Build: `docker build -t 123-lab115 .`
3. Run: `docker run -d -p 8080:80 123-lab115`

Or deploy via Coolify as a Dockerfile-based application.
