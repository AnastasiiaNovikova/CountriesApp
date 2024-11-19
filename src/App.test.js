import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('render search input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/search by name, language, currency/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders country grid with data', async () => {
  render(<App />);
  
  const countryNameHeader = await screen.findByText(/country name/i);
  expect(countryNameHeader).toBeInTheDocument();
});

test('adds to favorites', async () => {
  render(<App />);
  const buttons = await screen.findAllByRole('button', { name: /add to favorite/i });
  fireEvent.click(buttons[0]);
  const favoriteSection = screen.getByText(/your favorite countries/i);
  expect(favoriteSection).toBeInTheDocument();
});
