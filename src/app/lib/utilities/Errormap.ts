export function getReadableErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/email-already-in-use':
        return 'The email address is already in use by another account.';
      // Add more cases as needed
      default:
        return 'An unknown error occurred.';
    }
  }