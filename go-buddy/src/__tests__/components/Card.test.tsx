import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {Card} from '../../components/Card';

describe('Card Component', () => {
  it('should render children correctly', () => {
    const {getByText} = render(
      <Card>
        <Text>Card Content</Text>
      </Card>,
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('should render multiple children', () => {
    const {getByText} = render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>,
    );
    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });
});
