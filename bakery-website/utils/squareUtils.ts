declare global {
    interface Window {
      Square: {
        payments(appId: string, locationId: string): Promise<SquarePayments>;
      }
    }
  }
  
  type SquarePayments = {
    card(): Promise<{
      attach(elementId: string): Promise<void>;
      tokenize(): Promise<{
        status: 'OK' | 'ERROR';
        token?: string;
        errors?: Array<{
          code: string;
          detail: string;
          field?: string;
        }>;
      }>;
    }>;
  };
  
  export async function loadSquareSdk(): Promise<SquarePayments> {
    if (typeof window === 'undefined') {
      throw new Error('Square SDK can only be loaded in browser');
    }
  
    // Wait for Square to be available
    let attempts = 0;
    while (!window.Square && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
  
    if (!window.Square) {
      throw new Error('Square SDK failed to load');
    }
  
    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    
    console.log('Square SDK initialized with:', { appId, locationId });
    
    if (!appId || !locationId) {
      throw new Error('Square configuration missing');
    }
  
    try {
      const payments = await window.Square.payments(appId, locationId);
      return payments;
    } catch (error) {
      console.error('Error initializing Square payments:', error);
      throw new Error('Failed to initialize Square payments');
    }
  }
  
  export {};