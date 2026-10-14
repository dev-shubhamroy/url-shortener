# URL Shortener

A URL shortener backend built with Node.js, Express.js, PostgreSQL, and Redis. It converts long URLs into short, shareable links and redirects users to their original destinations.

## Features

- Generate short URLs using Nano ID
- Redirect short URLs to their original destinations
- Store URLs persistently in PostgreSQL
- Cache frequently accessed URLs in Redis
- Cache entries expire after one hour
- Validate URLs and allow only HTTP and HTTPS protocols
- Return appropriate error responses for invalid URLs and missing short codes

## Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** PostgreSQL
- **Caching:** Redis
- **Short Code Generation:** Nano ID
- **Configuration:** dotenv
- **Development:** Nodemon

## Getting Started

### Prerequisites

Install Node.js, PostgreSQL, and Redis.

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

Create a PostgreSQL database and the required table:

```sql
CREATE DATABASE url_shortener;
```

Connect to the `url_shortener` database and run:

```sql
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Create a `.env` file in the project root:

```dotenv
DATABASE_URL=postgresql://localhost:5432/url_shortener
```

Start PostgreSQL and Redis, then start the development server:

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

The API returns a short code, the short URL, and the original URL.

### 3. Redirect to the Original URL

`GET /:shortCode`

Redirects to the original destination. Redis is checked first; if the URL isn't cached, PostgreSQL is queried and the result is cached for one hour.

## Current Limitations

- The server currently uses a local development setup.
- Automated tests, click analytics, and production deployment have not yet been implemented.
- Performance improvements have not yet been benchmarked.

## Future Improvements

- Add automated tests and API documentation
- Implement click analytics and usage tracking
- Deploy the application to a production environment
- Benchmark redirect performance with and without Redis

## License

No license has been specified yet.