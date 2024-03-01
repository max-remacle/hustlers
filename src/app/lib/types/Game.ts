import { Player } from "./Player";

export type Game = {
  id: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  played: boolean;
  opponentScore: number;
  confirmedPlayers: Player[];
  declinedPlayers: Player[];
  rideOffers: Player[];
  rideRequests: Player[];
  teamScore: number;
  opponent: string;
  field: string;
  dod: string | null;
  dodTime: string | null;
};
