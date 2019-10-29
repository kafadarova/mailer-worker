const { checkRepeatType } = require('../controllers/helpers');

describe('Helpers function', () => {
  it('should return the correct object if type is "weekly"', () => {
    const response = checkRepeatType('weekly', [0, 2, 5]);
    expect(response).toEqual({ repeatType: 'weeks', days: [0, 2, 5], rule: ['hour', 'minute', 'dayOfWeek'] });
  });

  it('should return the correct object  if type is "monthly"', () => {
    const response = checkRepeatType('monthly', []);
    expect(response).toEqual({ repeatType: 'months', days: null, rule: ['date', 'hour', 'minute'] });
  });

  it('should return the object with "days" equal to null', () => {
    const response = checkRepeatType('monthly');
    expect(response).toEqual({ repeatType: 'months', days: null, rule: ['date', 'hour', 'minute'] });
  });
});
