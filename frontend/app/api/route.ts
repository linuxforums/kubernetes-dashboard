// This file is needed for Next.js API routes
// The actual API is proxied to the backend server
export async function GET() {
  return Response.json({ message: 'API routes are handled by the backend server' });
}

