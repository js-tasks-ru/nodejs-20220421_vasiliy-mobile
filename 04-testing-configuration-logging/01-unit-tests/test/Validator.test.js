const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидация: передан неверный тип', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 10,
        },
        age: {
          type: 'number',
          min: 18,
          max: 100,
        },
      });

      const errors = validator.validate({name: 20, age: 'eighteen'});

      expect(errors).to.have.length(2);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');

      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидация: минимальное значение больше максимального', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 3,
        },
      });

      const errors = validator.validate({name: 'username'});

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('max is less than min');
    });
  });

  describe('Validator of strings', () => {
    it('валидация строки: строка слишком короткая', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидация строки: строка слишком длинная', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'username'});

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 8');
    });

    it('валидация строки: строка равна минимальной длине', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'Jon'});

      expect(errors).to.have.length(0);
    });

    it('валидация строки: строка между минимальной и максимальной длиной', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Jorge'});

      expect(errors).to.have.length(0);
    });

    it('валидация строки: строка равна максимальной длине', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'Maria'});

      expect(errors).to.have.length(0);
    });
  });

  describe('Validator of numbers', () => {
    it('валидация числа: значение слишком мало', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 50,
        },
      });

      const errors = validator.validate({age: 10});

      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 10');
    });

    it('валидация числа: значение слишком велико', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 50,
        },
      });

      const errors = validator.validate({age: 80});

      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 50, got 80');
    });

    it('валидация числа: значение равно минимальному', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 50,
        },
      });

      const errors = validator.validate({age: 18});

      expect(errors).to.have.length(0);
    });

    it('валидация числа: значение находится в между min и max', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 50,
        },
      });

      const errors = validator.validate({age: 28});

      expect(errors).to.have.length(0);
    });

    it('валидация числа: значение равно максимальному', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 50,
        },
      });

      const errors = validator.validate({age: 50});

      expect(errors).to.have.length(0);
    });
  });
});
