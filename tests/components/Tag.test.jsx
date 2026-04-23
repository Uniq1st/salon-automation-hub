import { describe, it, expect } from 'vitest';
import Tag from '../src/components/Tag';

describe('Tag Component', () => {
  it('renders with correct styles', () => {
    const { container } = render(<Tag color="#7F77DD" bg="#EEEDFE">Test Tag</Tag>);
    expect(container.firstChild).toHaveStyle({
      background: '#EEEDFE',
      color: '#7F77DD',
    });
  });

  it('displays children text', () => {
    const { getByText } = render(<Tag color="#000" bg="#fff">Test Content</Tag>);
    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
