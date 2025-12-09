export interface Payload {
  username: string;
  sub: number; // Access ID
  role: number; // Role ID to manage permissions
  iat: number; // Issued at (create at)
  exp: number; // Expiration (expire at)
}