/**
 * Simple test script to demonstrate the profanity filter
 * Run with: node -r ts-node/register test-profanity.ts
 * Or with ts-node: ts-node test-profanity.ts
 */

import {
  containsProfanity,
  validateUserInput,
  validateActivityInput,
  validateConnectionMessage,
} from './profanityFilter';

console.log('=== Profanity Filter Test ===\n');

// Test 1: Basic profanity detection
console.log('Test 1: Basic Profanity Detection');
console.log('  "Hello world" contains profanity:', containsProfanity('Hello world'));
console.log('  "This is shit" contains profanity:', containsProfanity('This is shit'));
console.log('  "What the fuck" contains profanity:', containsProfanity('What the fuck'));
console.log('  "F*ck this" contains profanity:', containsProfanity('F*ck this'));
console.log('');

// Test 2: User input validation
console.log('Test 2: User Input Validation');
const cleanUser = validateUserInput({
  name: 'John Doe',
  bio: 'Software engineering student at UW',
  skills: ['Python', 'JavaScript', 'React'],
});
console.log('  Clean user profile:', cleanUser);

const dirtyUser = validateUserInput({
  name: 'John Doe',
  bio: 'I am shit at coding',
  skills: ['Python', 'JavaScript'],
});
console.log('  User with profanity:', dirtyUser);
console.log('');

// Test 3: Activity input validation
console.log('Test 3: Activity Input Validation');
const cleanActivity = validateActivityInput({
  title: 'Basketball Game',
  description: 'Join us for a fun game at the IMA',
  userName: 'John Doe',
});
console.log('  Clean activity:', cleanActivity);

const dirtyActivity = validateActivityInput({
  title: 'Fucking awesome game',
  description: 'Come play basketball',
  userName: 'John Doe',
});
console.log('  Activity with profanity:', dirtyActivity);
console.log('');

// Test 4: Connection message validation
console.log('Test 4: Connection Message Validation');
const cleanMessage = validateConnectionMessage('Hi, would love to connect!');
console.log('  Clean message:', cleanMessage);

const dirtyMessage = validateConnectionMessage('Hey bitch, lets connect');
console.log('  Message with profanity:', dirtyMessage);
console.log('');

// Test 5: Special character variations
console.log('Test 5: Special Character Variations');
console.log('  "sh*t" contains profanity:', containsProfanity('sh*t'));
console.log('  "f@ck" contains profanity:', containsProfanity('f@ck'));
console.log('  "b!tch" contains profanity:', containsProfanity('b!tch'));
console.log('');

// Test 6: Case insensitivity
console.log('Test 6: Case Insensitivity');
console.log('  "SHIT" contains profanity:', containsProfanity('SHIT'));
console.log('  "FuCk" contains profanity:', containsProfanity('FuCk'));
console.log('  "BiTcH" contains profanity:', containsProfanity('BiTcH'));
console.log('');

// Test 7: Word boundaries (should NOT flag legitimate words)
console.log('Test 7: Word Boundaries (False Positive Prevention)');
console.log('  "assignment" contains profanity:', containsProfanity('assignment'));
console.log('  "hello" contains profanity:', containsProfanity('hello'));
console.log('  "classical" contains profanity:', containsProfanity('classical'));
console.log('');

console.log('=== All Tests Complete ===');
