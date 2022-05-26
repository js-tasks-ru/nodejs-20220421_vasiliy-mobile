const Validator = require('../Validator');
const expect = require('chai').expect;

describe.only('testing-configuration-logging/unit-tests', () => {
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
  });
});
