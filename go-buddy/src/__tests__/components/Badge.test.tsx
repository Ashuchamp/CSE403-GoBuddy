import React from 'react';
import {render} from '@testing-library/react-native';
import {Badge} from '../../components/Badge';

describe('Badge Component', () => {
  it('should render with text content', () => {
    const {getByText} = render(<Badge>Test Badge</Badge>);
    expect(getByText('Test Badge')).toBeTruthy();
  });

  it('should render with primary variant', () => {
    const {getByText} = render(<Badge variant="primary">Primary</Badge>);
    expect(getByText('Primary')).toBeTruthy();
  });
});
