import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', () => {
	render(<ContactForm />);
});

test('renders the contact form header', () => {
	render(<ContactForm />);
	const formHeader = screen.queryByText(/contact form/i);
	expect(formHeader).toBeInTheDocument();
	expect(formHeader).toBeTruthy();
	expect(formHeader).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
	render(<ContactForm />);
	const fNameInput = screen.getByLabelText(/first name\*/i);
	userEvent.type(fNameInput, 'abc');
	const fNameError = screen.queryAllByTestId(/error/i);
	await waitFor(() => {
		expect(fNameError.length === 1).toBeTruthy();
		expect(fNameError[0]).toBeInTheDocument();
	});
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
	render(<ContactForm />);
	const submitButton = screen.getByRole('button');
	userEvent.click(submitButton);
	const allEmptyErrors = screen.queryAllByTestId('error');
	expect(allEmptyErrors.length === 3).toBeTruthy();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
	render(<ContactForm />);
	const fNameInput = screen.getByLabelText(/first name\*/i);
	userEvent.type(fNameInput, 'abcde');
	const lNameInput = screen.getByLabelText(/last name\*/i);
	userEvent.type(lNameInput, 'abcde');
	const submitButton = screen.getByRole('button');
	userEvent.click(submitButton);
	const emailError = screen.queryAllByTestId(/error/i);
	await waitFor(() => {
		expect(emailError[0]).toBeInTheDocument();
		expect(emailError).toHaveLength(1);
	});
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	render(<ContactForm />);
	const emailInput = screen.getByLabelText(/email\*/i);
	userEvent.type(emailInput, 'abcde');
	const emailError = screen.queryByTestId(/error/i);
	await waitFor(() => {
		expect(emailError).toBeInTheDocument();
		expect(emailError).toHaveTextContent(
			/email must be a valid email address/i
		);
	});
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
	render(<ContactForm />);
	const fNameInput = screen.getByLabelText(/first name\*/i);
	userEvent.type(fNameInput, 'abcde');
	const emailInput = screen.getByLabelText(/email\*/i);
	userEvent.type(emailInput, 'test@email.com');
	const submitButton = screen.getByRole('button');
	userEvent.click(submitButton);
	const lNameError = screen.queryByTestId(/error/i);
	await waitFor(() => {
		expect(lNameError).toBeInTheDocument();
		expect(lNameError).toHaveTextContent(/lastName is a required field/i);
	});
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
	render(<ContactForm />);
	const fNameInput = screen.getByLabelText(/first name\*/i);
	userEvent.type(fNameInput, 'abcde');
	const lNameInput = screen.getByLabelText(/last name\*/i);
	userEvent.type(lNameInput, 'abcde');
	const emailInput = screen.getByLabelText(/email\*/i);
	userEvent.type(emailInput, 'test@email.com');
	const submitButton = screen.getByRole('button');
	await waitFor(() => {
		expect(screen.queryAllByTestId(/error/i)).toHaveLength(0);
		expect(screen.queryByTestId('firstnameDisplay')).not.toBeInTheDocument();
		expect(screen.queryByTestId('lastnameDisplay')).not.toBeInTheDocument();
		expect(screen.queryByTestId('emailDisplay')).not.toBeInTheDocument();
		expect(screen.queryByTestId('messageDisplay')).not.toBeInTheDocument();
	});
	userEvent.click(submitButton);
	await waitFor(() => {
		expect(screen.queryByTestId('firstnameDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('firstnameDisplay')).toHaveTextContent('abcde');
		expect(screen.queryByTestId('lastnameDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('lastnameDisplay')).toHaveTextContent('abcde');
		expect(screen.queryByTestId('emailDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('emailDisplay')).toHaveTextContent(
			'test@email.com'
		);
		expect(screen.queryByTestId('messageDisplay')).not.toBeInTheDocument();
	});
});

test('renders all fields text when all fields are submitted.', async () => {
	render(<ContactForm />);
	const fNameInput = screen.getByLabelText(/first name\*/i);
	userEvent.type(fNameInput, 'abcde');
	const lNameInput = screen.getByLabelText(/last name\*/i);
	userEvent.type(lNameInput, 'abcde');
	const emailInput = screen.getByLabelText(/email\*/i);
	userEvent.type(emailInput, 'test@email.com');
	const messageInput = screen.getByLabelText(/message/i);
	userEvent.type(messageInput, 'test message.');
	const submitButton = screen.getByRole('button');
	await waitFor(() => {
		expect(screen.queryAllByTestId(/error/i)).toHaveLength(0);
		expect(screen.queryByTestId('firstnameDisplay')).not.toBeInTheDocument();
		expect(screen.queryByTestId('lastnameDisplay')).not.toBeInTheDocument();
		expect(screen.queryByTestId('emailDisplay')).not.toBeInTheDocument();
		expect(screen.queryByTestId('messageDisplay')).not.toBeInTheDocument();
	});
	userEvent.click(submitButton);
	await waitFor(() => {
		expect(screen.queryByTestId('firstnameDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('firstnameDisplay')).toHaveTextContent('abcde');
		expect(screen.queryByTestId('lastnameDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('lastnameDisplay')).toHaveTextContent('abcde');
		expect(screen.queryByTestId('emailDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('emailDisplay')).toHaveTextContent(
			'test@email.com'
		);
		expect(screen.queryByTestId('messageDisplay')).toBeInTheDocument();
		expect(screen.queryByTestId('messageDisplay')).toHaveTextContent(
			'test message.'
		);
	});
});
