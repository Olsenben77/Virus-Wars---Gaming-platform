`use strict`;

describe(`first set`, () => {
  beforeEach(() => {
    // do something
    console.log(`begin tests`);
  });
  afterAll(() => {
    console.log(`end tests`);
    // do something
  });
  test(/*...*/);
  test(/*...*/);
});

describe(`second set`, () => {
  beforeEach(() => {
    // do something
    console.log(`begin tests`);
  });
  beforeAll(() => {
    // do something
    console.log(`end tests`);
  });
  test(/*...*/);
  test(/*...*/);
});
