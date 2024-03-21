export type Game = {
  id: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  played: boolean;
  opponentScore: number;
  confirmedPlayers: string[];
  declinedPlayers: string[];
  rideOffers: string[];
  rideRequests: string[];
  teamScore: number;
  opponent: string;
  field: string;
  dod: string | null;
  dodTime: string | null;
  cancelled: boolean
};
