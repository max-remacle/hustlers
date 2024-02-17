export type Training = {
    id: string;
    field: string;
    date: {
        seconds: number;
        nanoseconds: number;
      };
    cancelled: boolean;
    confirmedPlayers: string[];
    declinedPlayers: string[];
}