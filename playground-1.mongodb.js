/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

use("personal_website");

db.getCollection('feedback').deleteMany({});
