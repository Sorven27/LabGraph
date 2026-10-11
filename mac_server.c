#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

static const char *shutdown_token = NULL;
static volatile sig_atomic_t shutdown_requested = 0;

static int contains_case_insensitive(const char *text, const char *needle) {
  size_t length = strlen(needle);
  for (const char *p = text; *p; p++) {
    if (!strncasecmp(p, needle, length)) return 1;
  }
  return 0;
}

static const char *mime_type(const char *path) {
  const char *ext = strrchr(path, '.');
  if (!ext) return "application/octet-stream";
  if (!strcmp(ext, ".html")) return "text/html; charset=utf-8";
  if (!strcmp(ext, ".css")) return "text/css; charset=utf-8";
  if (!strcmp(ext, ".js")) return "application/javascript; charset=utf-8";
  if (!strcmp(ext, ".svg")) return "image/svg+xml";
  if (!strcmp(ext, ".png")) return "image/png";
  if (!strcmp(ext, ".ico")) return "image/x-icon";
  return "application/octet-stream";
}

static int hex_value(char c) {
  if (c >= '0' && c <= '9') return c - '0';
  if (c >= 'a' && c <= 'f') return c - 'a' + 10;
  if (c >= 'A' && c <= 'F') return c - 'A' + 10;
  return -1;
}

static void decode_url(char *dst, size_t cap, const char *src) {
  size_t j = 0;
  for (size_t i = 0; src[i] && src[i] != '?' && j + 1 < cap; i++) {
    if (src[i] == '%' && src[i + 1] && src[i + 2]) {
      int a = hex_value(src[i + 1]), b = hex_value(src[i + 2]);
      if (a >= 0 && b >= 0) { dst[j++] = (char)((a << 4) | b); i += 2; continue; }
    }
    dst[j++] = src[i];
  }
  dst[j] = '\0';
}

static void respond_text(int client, int status, const char *message) {
  char header[512];
  int length = (int)strlen(message);
  int n = snprintf(header, sizeof(header),
    "HTTP/1.1 %d\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: %d\r\nConnection: close\r\n\r\n",
    status, length);
  send(client, header, (size_t)n, 0);
  send(client, message, (size_t)length, 0);
}

static void respond_json(int client, const char *message) {
  char header[512];
  int length = (int)strlen(message);
  int n = snprintf(header, sizeof(header),
    "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: %d\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n",
    length);
  send(client, header, (size_t)n, 0);
  send(client, message, (size_t)length, 0);
}

static void serve_client(int client, const char *root) {
  char request[8192] = {0}, method[16] = {0}, raw_path[4096] = {0};
  ssize_t got = recv(client, request, sizeof(request) - 1, 0);
  if (got <= 0 || sscanf(request, "%15s %4095s", method, raw_path) != 2) {
    respond_text(client, 400, "Bad request"); return;
  }
  if (!strcmp(raw_path, "/__labgraph/status") && !strcmp(method, "GET")) {
    char json[512];
    snprintf(json, sizeof(json), "{\"app\":\"LabGraph\",\"version\":2,\"platform\":\"macOS\",\"shutdown\":true,\"token\":\"%s\"}", shutdown_token);
    respond_json(client, json); return;
  }
  if (!strcmp(raw_path, "/__labgraph/shutdown") && !strcmp(method, "POST")) {
    char expected[512];
    snprintf(expected, sizeof(expected), "X-LabGraph-Token: %s", shutdown_token);
    if (!contains_case_insensitive(request, expected)) { respond_text(client, 403, "Forbidden"); return; }
    respond_json(client, "{\"ok\":true}");
    shutdown_requested = 1;
    return;
  }
  if (strcmp(method, "GET") && strcmp(method, "HEAD")) {
    respond_text(client, 405, "Method not allowed"); return;
  }

  char decoded[4096];
  decode_url(decoded, sizeof(decoded), raw_path);
  if (!strcmp(decoded, "/")) strcpy(decoded, "/index.html");
  if (strstr(decoded, "..") || decoded[0] != '/') {
    respond_text(client, 403, "Forbidden"); return;
  }

  char path[8192];
  snprintf(path, sizeof(path), "%s%s", root, decoded);
  int file = open(path, O_RDONLY);
  struct stat info;
  if (file < 0 || fstat(file, &info) || !S_ISREG(info.st_mode)) {
    if (file >= 0) close(file);
    respond_text(client, 404, "Not found"); return;
  }

  char header[1024];
  int n = snprintf(header, sizeof(header),
    "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %lld\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n",
    mime_type(path), (long long)info.st_size);
  send(client, header, (size_t)n, 0);
  if (!strcmp(method, "GET")) {
    char buffer[32768];
    ssize_t count;
    while ((count = read(file, buffer, sizeof(buffer))) > 0) {
      ssize_t sent = 0;
      while (sent < count) {
        ssize_t part = send(client, buffer + sent, (size_t)(count - sent), 0);
        if (part <= 0) break;
        sent += part;
      }
    }
  }
  close(file);
}

int main(int argc, char **argv) {
  if (argc != 4) return 2;
  int port = atoi(argv[1]);
  if (port < 1024 || port > 65535) return 2;
  shutdown_token = argv[3];
  if (!shutdown_token[0] || strlen(shutdown_token) > 200) return 2;
  signal(SIGPIPE, SIG_IGN);

  int server = socket(AF_INET, SOCK_STREAM, 0);
  if (server < 0) return 3;
  int yes = 1;
  setsockopt(server, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));
  struct sockaddr_in address = {0};
  address.sin_family = AF_INET;
  address.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
  address.sin_port = htons((unsigned short)port);
  if (bind(server, (struct sockaddr *)&address, sizeof(address)) || listen(server, 16)) return 4;

  time_t last_request = time(NULL);
  while (!shutdown_requested) {
    fd_set readable;
    FD_ZERO(&readable);
    FD_SET(server, &readable);
    struct timeval timeout = {1, 0};
    int ready = select(server + 1, &readable, NULL, NULL, &timeout);
    if (ready == 0) {
      if (time(NULL) - last_request >= 300) break;
      continue;
    }
    if (ready < 0) {
      if (errno == EINTR) continue;
      break;
    }
    int client = accept(server, NULL, NULL);
    if (client >= 0) { last_request = time(NULL); serve_client(client, argv[2]); close(client); }
    else if (errno != EINTR) break;
  }
  close(server);
  return 0;
}
