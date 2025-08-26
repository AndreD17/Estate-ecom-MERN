// src/utils/gravatar.js
import md5 from 'md5';

export function getGravatar(email) {
  if (!email) return null;
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}
