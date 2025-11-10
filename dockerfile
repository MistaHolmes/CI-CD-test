# Start from a very small base image
FROM alpine:latest

# Add a simple label
LABEL maintainer="you@example.com"

# Run a basic command (for testing)
CMD ["echo", "Hello from GitHub Actions Docker build!"]
