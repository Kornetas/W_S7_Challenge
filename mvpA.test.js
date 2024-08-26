/*
Codegrade Setup

1- Global setup script
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs; cg-jest install; npm i -g jest@29.6.4
2- Per-student setup script
mv $FIXTURES/* . && npm install
3- Levels
3A- Codegrade tests
cg-jest run -- mvpA.test.js --runInBand --forceExit
3B Learner tests
cg-jest run -- mvpB.test.js --runInBand --forceExit
4- Fixtures
mvpA.test.js
*/
import React from 'react';
import App from './frontend/components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import server from './backend/mock-server';

jest.setTimeout(1050); // Adjusted timeout for Codegrade environment

const waitForOptions = { timeout: 250 };
const queryOptions = { exact: false };

// Helper function to render the app with router
const renderApp = ui => {
  window.localStorage.clear();
  window.history.pushState({}, 'Test page', '/');
  return render(ui);
};

beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => renderApp(<Router><App /></Router>));
afterEach(() => server.resetHandlers());

describe('Sprint 7 Challenge Codegrade Tests', () => {
  describe('App routing', () => {
    test('[1] <App /> Renders without crashing', () => {
      expect(document.body).toBeInTheDocument();
      screen.debug()
    });

    test('[2] The <a>Home</a> and <a>Order</a> links navigate to "/" and "/order"', () => {
      expect(document.location.pathname).toBe('/');
      fireEvent.click(screen.getByText('Order', queryOptions));
      expect(document.location.pathname).toBe('/order');
      fireEvent.click(screen.getByText('Home', queryOptions));
      expect(document.location.pathname).toBe('/');
    });

    test('[3] Renders the <Home /> component on path "/"', () => {
      screen.getByText('Welcome to Bloom Pizza', queryOptions);
    });

    test('[4] Renders the <Form /> component on path "/order"', () => {
      fireEvent.click(screen.getByText('Order', queryOptions));
      screen.getByText('Order Your Pizza', queryOptions);
    });

    test('[5] Clicking on the pizza image navigates to "/order"', () => {
      fireEvent.click(screen.getByAltText('order-pizza'));
      expect(document.location.pathname).toBe('/order');
    });
  });

  let nameInput, sizeSelect, pepperoniCheckbox, peppersCheckbox, pineappleCheckbox, mushroomsCheckbox, hamCheckbox, submitButton;

  const getFormElements = () => {
    nameInput = screen.getByLabelText(/full name/i);
    sizeSelect = screen.getByLabelText(/size/i);
    pepperoniCheckbox = screen.getByLabelText(/pepperoni/i);
    peppersCheckbox = screen.getByLabelText(/green peppers/i);
    pineappleCheckbox = screen.getByLabelText(/pineapple/i);
    mushroomsCheckbox = screen.getByLabelText(/mushrooms/i);
    hamCheckbox = screen.getByLabelText(/ham/i);
    submitButton = screen.getByRole('button', { name: /submit/i });
  };

  describe('Form submission success', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Order', queryOptions));
      getFormElements();
    });

    test('[6] Successful order with no toppings renders correct message', async () => {
      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: 'Mollusk' } });
        fireEvent.change(sizeSelect, { target: { value: 'L' } });
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeEnabled());

      await waitFor(() => {
        fireEvent.click(submitButton);
      }, waitForOptions);

      await waitFor(() => {
        screen.getByText('Thank you for your order, Mollusk!', queryOptions);
        screen.getByText('Your large pizza', queryOptions);
        screen.getByText('with no toppings', queryOptions);
      }, waitForOptions);
    });

    test('[7] Successful order with some toppings renders correct message', async () => {
      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: 'Fish' } });
        fireEvent.change(sizeSelect, { target: { value: 'S' } });
        fireEvent.click(pepperoniCheckbox);
        fireEvent.click(pineappleCheckbox);
        fireEvent.click(hamCheckbox);
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeEnabled());

      await waitFor(() => {
        fireEvent.click(submitButton);
      }, waitForOptions);

      await waitFor(() => {
        screen.getByText('Thank you for your order, Fish!', queryOptions);
        screen.getByText('Your small pizza', queryOptions);
        screen.getByText('with 3 toppings', queryOptions);
      }, waitForOptions);
    });

    test('[8] A successful order clears the form', async () => {
      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: 'Fish' } });
        fireEvent.change(sizeSelect, { target: { value: 'S' } });
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeEnabled());

      await waitFor(() => {
        fireEvent.click(submitButton);
      }, waitForOptions);

      await waitFor(() => {
        screen.getByText('Thank you', queryOptions);
      }, waitForOptions);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(sizeSelect.value).toBe('');
        expect(pepperoniCheckbox.checked).toBe(false);
        expect(peppersCheckbox.checked).toBe(false);
        expect(pineappleCheckbox.checked).toBe(false);
        expect(mushroomsCheckbox.checked).toBe(false);
        expect(hamCheckbox.checked).toBe(false);
      });
    });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Order', queryOptions));
      getFormElements();
    });

    test('[9] Submit only enables if `fullName` and `size` pass validation', async () => {
      expect(submitButton).toBeDisabled(); // initial state

      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: '123' } });
        fireEvent.change(sizeSelect, { target: { value: 'S' } });
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeEnabled());

      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: '12' } }); // BAD VALUE
        fireEvent.change(sizeSelect, { target: { value: 'S' } });
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeDisabled());

      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: '123' } });
        fireEvent.change(sizeSelect, { target: { value: 'M' } });
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeEnabled());

      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: '123' } });
        fireEvent.change(sizeSelect, { target: { value: 'X' } }); // BAD VALUE
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeDisabled());

      await waitFor(() => {
        fireEvent.change(nameInput, { target: { value: '123' } });
        fireEvent.change(sizeSelect, { target: { value: 'L' } });
      }, waitForOptions);

      await waitFor(() => expect(submitButton).toBeEnabled());
    });

    test('[10] Validation of `fullName` renders correct error message', async () => {
      const validationError = 'Full name must be at least 3 characters';
    
     
      await waitFor(() => {
        // Simulate entering a short name (invalid)
        fireEvent.change(nameInput, { target: { value: '1' } });
        fireEvent.blur(nameInput); // trigger blur event to validate
      }, waitForOptions);
    
      // Expect validation error to appear
      await waitFor(() => {
        expect(screen.getByText(validationError, queryOptions)).toBeInTheDocument();
      }, waitForOptions);
    
      await waitFor(() => {
        // Now enter a valid name
        fireEvent.change(nameInput, { target: { value: '123' } });
        fireEvent.blur(nameInput); // trigger blur event to validate
      }, waitForOptions);
    
      // Expect the validation error to disapear
      await waitFor(() => {
        expect(screen.queryByText(validationError, queryOptions)).not.toBeInTheDocument();
      }, waitForOptions);
    });
    

    test('[11] Validation of `size` renders correct error message', async () => {
      const validationError = 'Size must be S, M, or L';
    
   
      await waitFor(() => {
        // Initially select a valid size
        fireEvent.change(sizeSelect, { target: { value: 'S' } });
      }, waitForOptions);
    
      // Ensure no error message is shown initially
      await waitFor(() => {
        expect(screen.queryByText((content) => content.includes(validationError))).not.toBeInTheDocument();
      }, waitForOptions);
    
      await waitFor(() => {
        // Change to an invalid size (empty value)
        fireEvent.change(sizeSelect, { target: { value: '' } });
        fireEvent.blur(sizeSelect); // Trigger blur to validate
      }, waitForOptions);
    
      // Check that the validation error is rendered
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes(validationError))).toBeInTheDocument();
      }, waitForOptions);
    
      await waitFor(() => {
        // Now change to a valid size again
        fireEvent.change(sizeSelect, { target: { value: 'M' } });
        fireEvent.blur(sizeSelect); 
      }, waitForOptions);
    
      
      await waitFor(() => {
        expect(screen.queryByText((content) => content.includes(validationError))).not.toBeInTheDocument();
      }, waitForOptions);
    });
  });
});
