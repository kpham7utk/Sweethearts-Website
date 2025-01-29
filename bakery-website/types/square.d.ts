declare namespace Square {
    interface PaymentsInstance {
      card(): Promise<CardInstance>;
    }
  
    interface CardInstance {
      attach(elementId: string): Promise<void>;
      tokenize(): Promise<TokenizationResult>;
    }
  
    interface TokenizationResult {
      status: 'OK' | 'ERROR';
      token?: string;
      errors?: Array<{
        code: string;
        detail: string;
        field?: string;
      }>;
    }
  }
  
  interface Window {
    Square: {
      payments(appId: string, locationId: string): Promise<Square.PaymentsInstance>;
    };
  }
  
  // Add this line at the end to make it a module
  export {};