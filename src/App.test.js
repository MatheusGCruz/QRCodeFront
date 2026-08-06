import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

const axios = require('axios');

beforeEach(() => {
  window.history.pushState({}, '', '/');
  axios.post.mockReset();
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

test('renders the Tanuki generator on the home route', async () => {
  render(<App />);

  const heading = await screen.findByRole('heading', { name: /tanuki/i, level: 1 });
  expect(heading).toBeInTheDocument();
  expect(screen.getByLabelText(/enter the link/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
});

test('shows the 404 page for an unknown short link', async () => {
  axios.post.mockRejectedValue(new Error('not found'));
  window.history.pushState({}, '', '/unknown123');

  render(<App />);

  expect(await screen.findByText('Link not found')).toBeInTheDocument();
});

test('submits the form and shows the generated short link', async () => {
  axios.post.mockResolvedValue({
    status: 200,
    data: {
      desiredUrl: 'https://example.com/page',
      pinCode: 'https://tanuki.click/abc123',
      base64: 'iVBORw0KGgo=',
    },
  });

  render(<App />);
  await screen.findByRole('heading', { name: /tanuki/i, level: 1 });

  const input = screen.getByLabelText(/enter the link/i);
  await userEvent.type(input, 'https://example.com/page');
  await userEvent.click(screen.getByRole('button', { name: /generate/i }));

  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('generateQrCode'),
    'https://example.com/page',
    expect.anything()
  );
  expect(await screen.findByText(/tanuki\.click\/abc123/i)).toBeInTheDocument();
});
