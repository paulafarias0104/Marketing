FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN useradd -r marketing && chown -R marketing:marketing /app
USER marketing
ENV PORT=8080
EXPOSE 8080
CMD ["python", "server.py"]
