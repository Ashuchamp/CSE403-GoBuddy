import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../../components/Button';

describe('Button Component', () => {
  it('should render with text content', () => {
    const {getByText} = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(<Button onPress={onPressMock}>Press Me</Button>);

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <Button onPress={onPressMock} disabled>
        Disabled Button
      </Button>,
    );

    fireEvent.press(getByText('Disabled Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
