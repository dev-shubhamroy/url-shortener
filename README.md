# URL Shortener

A URL shortener backend built with Node.js and Express.js. It converts long URLs into short, shareable links and redirects users to their original destinations.

## Features

- Generate short URLs using unique short codes
- Redirect short URLs to their original destinations
- Validate URLs and allow only HTTP and HTTPS protocols
- Return appropriate error responses for invalid URLs and missing short codes
- JSON-based REST API

## Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Short Code Generation:** Nano ID
- **Configuration:** dotenv
- **Development:** Nodemon

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/).

### Installation

Clone the repository:

```bash
git clone https://github.com/royshubhamdev/url-shortener.git
cd url-shortener
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The server runs at `http://localhost:3000` by default.

## API Endpoints

### 1. Health Check

`GET /`

Returns the API status.

### 2. Create a Short URL

`POST /api/shorten`

Request body:

```json
{
  "longUrl": "https://www.google.com"
}
```

Example response:

```json
{
  "shortCode": "generated-code",
  "shortUrl": "http://localhost:3000/generated-code",
  "longUrl": "https://www.google.com/"
}
```

The generated short code will vary with each request.

### 3. Redirect to the Original URL

`GET /:shortCode`

Opening a valid short URL redirects the user to the original destination.

## Current Limitations

- URLs are stored in memory, so they are lost when the server restarts.
- PostgreSQL persistence and Redis caching are planned improvements.

## Future Improvements

- PostgreSQL integration for persistent URL storage
- Redis caching for faster redirects
- Click analytics and usage tracking
- Automated tests and API documentation

## License

This project is currently available without a specified license.