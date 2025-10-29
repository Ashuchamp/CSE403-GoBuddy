import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Input} from '../../components/Input';

describe('Input Component', () => {
  it('should render input field', () => {
    const {getByPlaceholderText} = render(<Input placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should handle text input', () => {
    const onChangeTextMock = jest.fn();
    const {getByPlaceholderText} = render(
      <Input placeholder="Enter text" onChangeText={onChangeTextMock} />,
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'Hello World');

    expect(onChangeTextMock).toHaveBeenCalledWith('Hello World');
  });

  it('should render error message', () => {
    const {getByText} = render(<Input placeholder="email@example.com" error="Invalid email" />);
    expect(getByText('Invalid email')).toBeTruthy();
  });
});
