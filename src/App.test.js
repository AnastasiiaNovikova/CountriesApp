import { render, screen } from '@testing-library/react';
import App from './App';

test('render search input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/search by name, language, currency/i);
  expect(inputElement).toBeInTheDocument();
});
