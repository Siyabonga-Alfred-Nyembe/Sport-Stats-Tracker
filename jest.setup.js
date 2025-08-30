// Polyfill TextEncoder/TextDecoder for Node environment
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Optional: setup Testing Library matchers
require("@testing-library/jest-dom");
