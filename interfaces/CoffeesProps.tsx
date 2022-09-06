
interface IDonation {
  account: string;
  name?: string;
  message?: string;
}

export interface CoffeesProps {
    coffeesList: {
        account: string;
        name?: string;
        message?: string;
        amount: number;
      }[]
}