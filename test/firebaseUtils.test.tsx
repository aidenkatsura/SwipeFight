import { render, fireEvent } from '@testing-library/react-native';
import ScorecardModal from '../components/ScorecardModal';

describe('ScorecardModal', () => {
  const participants = [
    { id: '1', name: 'Bob', photo: 'bob.jpg' },
    { id: '2', name: 'Alice', photo: 'alice.jpg' },
  ];

  test('handles winner selection and submit', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId } = render(
      <ScorecardModal
        visible={true}
        onClose={onClose}
        onSubmit={onSubmit}
        participants={participants}
      />
    );

    // Simulate selecting a winner
    fireEvent(getByTestId('result-submitter'), 'valueChange', '1');

    // Simulate pressing the submit button
    fireEvent.press(getByTestId('result-submit-button'));

    expect(onSubmit).toHaveBeenCalledWith('1');
    expect(onClose).toHaveBeenCalled();
  });
});