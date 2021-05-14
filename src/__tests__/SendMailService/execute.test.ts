import SendMailService from '../../services/SendMailService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSendEmail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: () => mockSendEmail(),
  }),
}));

jest.mock('fs', () => ({
  readFileSync: () => '',
}));

describe('SendMailService Execute', () => {
  it('should be possible to send an email.', async () => {
    await SendMailService.execute({
      to: 'test@email.com',
      subject: 'Test',
      path: '',
      variables: {},
    });

    expect(mockSendEmail).toBeCalled();
  });
});
