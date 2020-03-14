"use strict";

describe(`first set`, () => {
  beforeEach(() => {
    // do something
    console.log(`begin tests`);
  });
  afterAll(() => {
    console.log(`end tests`);
    // do something
  });
  test(
    test("ensure that load was called with the right input", () => {
      expect(load(Image)).tobe(public\assets\img\bacteria.png
    })
  );
  test(test("this.anims has the right content", () => {
    this.anims.create({
      key: `rotate`,
      frames: this.anims.generateFrameNumbers(`pill`, {
        start: 0,
        end: 5
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1
    }expect(return(frames)).tobe(public\assets\img\pill.png))
  }));
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
