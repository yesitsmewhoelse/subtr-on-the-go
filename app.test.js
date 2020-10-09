const request = require('supertest');
const app = require('./app');
const { getRandom, adjustForBorrowing, generateOptions } = require('./utils');

describe('Test the health check path', () => {
  test('It should response the GET method ping with pong', (done) => {
    request(app)
      .get('/ping')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('pong');
        done();
      });
  });
});

describe('Test the validations', () => {
  test('Should give error when params are missing', (done) => {
    request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('Should give error when wrong param types are passed', (done) => {
    request(app)
      .get('/?questions=hello&minuend_digits=six&subtrahend_digits=yes&borrowing=5')
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('Should give error when params range is exceeded', (done) => {
    request(app)
      .get('/?questions=10&minuend_digits=13&subtrahend_digits=11&borrowing=true')
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('Should give error when subtrahend digits is greater than minuend digits', (done) => {
    request(app)
      .get('/?questions=10&minuend_digits=6&subtrahend_digits=8&borrowing=true')
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('Should not give error when all values are valid', (done) => {
    request(app)
      .get('/?questions=10&minuend_digits=6&subtrahend_digits=4&borrowing=false')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Testing the functionality', () => {
  const questionCount = 5;
  const minuendDigits = 6;
  const subtrahendDigits = 6;
  test('should return as many questions as requested', (done) => {
    request(app)
      .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=false`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toEqual(questionCount);
        done();
      });
  });
  test('all minueneds should have as many digits as specified', (done) => {
    request(app)
      .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=false`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        (response.body.forEach((question) => {
          expect(question.minuend.toString().length).toEqual(minuendDigits);
        }));
        done();
      });
  });
  test('all subtrahends should have as many digits as specified', (done) => {
    request(app)
      .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=false`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        (response.body.forEach((question) => {
          expect(question.subtrahend.toString().length).toEqual(subtrahendDigits);
        }));
        done();
      });
  });
  test('subtrahend should be lesser or equal to minuend (no -ve result)', (done) => {
    request(app)
      .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=false`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        (response.body.forEach((question) => {
          expect(question.subtrahend).toBeLessThanOrEqual(question.minuend);
        }));
        done();
      });
  });
  test('correct answer should match', (done) => {
    request(app)
      .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=false`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        (response.body.forEach((question) => {
          expect(question.correct).toEqual(question.minuend - question.subtrahend);
        }));
        done();
      });
  });
  test('options should include correct answer', (done) => {
    request(app)
      .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=false`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        (response.body.forEach((question) => {
          expect(question.options).toContain(question.minuend - question.subtrahend);
        }));
        done();
      });
  });

  describe('Testing for borrowing', () => {
    test('no question should have borrowing if borrowing flag is false', (done) => {
      const borrowingFlag = false;
      request(app)
        .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=${borrowingFlag}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          (response.body.forEach((question) => {
            const minuend = Array.from(
              String(question.minuend), Number,
            ).reverse(); // arranged from least significant digit to most significants
            const subtrahend = Array.from(
              String(question.subtrahend), Number,
            ).reverse(); // arranged from least significant digit to most significants
            minuend.forEach((digit, index) => {
              expect(digit - (subtrahend[index] || 0)).toBeGreaterThanOrEqual(0);
            });
          }));
          done();
        });
    });
    test('all questions should have borrowing if borrowing flag is true', (done) => {
      const borrowingFlag = true;
      request(app)
        .get(`/?questions=${questionCount}&minuend_digits=${minuendDigits}&subtrahend_digits=${subtrahendDigits}&borrowing=${borrowingFlag}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          (response.body.forEach((question) => {
            const minuend = Array.from(
              String(question.minuend), Number,
            ).reverse(); // arranged from least significant digit to most significants
            const subtrahend = Array.from(
              String(question.subtrahend), Number,
            ).reverse(); // arranged from least significant digit to most significants
            const diffArray = minuend.map(
              (minuendDigit, index) => minuendDigit - (subtrahend[index] || 0),
            );
            // diffarray should not be all +ve
            expect(diffArray.every((diff) => diff > 0)).toEqual(false);
          }));
          done();
        });
    });
  });
});

describe('Testing util functions', () => {
  describe('Testing getRandom function', () => {
    const minValue = 431;
    const maxValue = 9421;
    test('should not be less than min value passed', () => {
      const result = getRandom(minValue, maxValue);
      expect(result).toBeGreaterThanOrEqual(minValue);
    });
    test('should not be greater than max value passed', () => {
      const result = getRandom(minValue, maxValue);
      expect(result).toBeLessThanOrEqual(maxValue);
    });
    test('should give distinct random results', () => {
      const result1 = getRandom(minValue, maxValue);
      const result2 = getRandom(minValue, maxValue);
      expect(result1).not.toEqual(result2);
    });
  });
  describe('Testing adjustForBorrowing function', () => {
    describe('When borrowing flag is true', () => {
      const borrowingFlag = true;
      test('should return same values if borrowing is present', () => {
        const minuend = 500;
        const subtrahend = 192;
        const result = adjustForBorrowing(
          minuend,
          subtrahend,
          borrowingFlag,
        );
        expect(result.minuend).toEqual(minuend);
        expect(result.subtrahend).toEqual(subtrahend);
      });
      test('should swap least significant non equal digit if borrowing not present', () => {
        const minuend = 585;
        const subtrahend = 110;
        const result = adjustForBorrowing(
          minuend,
          subtrahend,
          borrowingFlag,
        );
        expect(result.minuend).toEqual(580);
        expect(result.subtrahend).toEqual(115);
      });
    });
    describe('When borrowing flag is false', () => {
      const borrowingFlag = false;
      test('should return same values if borrowing is not present', () => {
        const minuend = 585;
        const subtrahend = 110;
        const result = adjustForBorrowing(
          minuend,
          subtrahend,
          borrowingFlag,
        );
        expect(result.minuend).toEqual(minuend);
        expect(result.subtrahend).toEqual(subtrahend);
      });
      test('should swap all digits where borrowing is present', () => {
        const minuend = 500;
        const subtrahend = 192;
        const result = adjustForBorrowing(
          minuend,
          subtrahend,
          borrowingFlag,
        );
        expect(result.minuend).toEqual(592);
        expect(result.subtrahend).toEqual(100);
      });
    });
  });
  describe('Testing generateOptions function', () => {
    const minuend = 500;
    const subtrahend = 192;
    test('should return array of 4 options', () => {
      const result = generateOptions(
        minuend,
        subtrahend,
      );
      expect(Array.isArray(result)).toEqual(true);
      expect(result).toHaveLength(4);
    });
    test('should contain actual answer', () => {
      const result = generateOptions(
        minuend,
        subtrahend,
      );
      expect(Array.isArray(result)).toEqual(true);
      expect(result).toContain(minuend - subtrahend);
    });
  });
});
