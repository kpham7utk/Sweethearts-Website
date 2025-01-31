interface SquarePayments {
  card(): Promise<{
    attach(elementId: string): Promise<void>;
    tokenize(): Promise<{
      status: "OK" | "ERROR";
      token?: string;
      errors?: Array<{
        code: string;
        detail: string;
        field?: string;
      }>;
    }>;
  }>;
}

interface SquareWindow extends Window {
  Square?: {
    payments(appId: string, locationId: string): Promise<SquarePayments>;
  };
}

export async function loadSquareSdk(): Promise<SquarePayments> {
  if (typeof window === 'undefined') {
    throw new Error('Square SDK can only be loaded in browser');
  }

  const win = window as SquareWindow;
  
  if (!win.Square) {
    throw new Error('Square SDK not loaded');
  }

  const payments = await win.Square.payments(
    process.env.NEXT_PUBLIC_SQUARE_APP_ID || '',
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || ''
  );

  return payments;
}