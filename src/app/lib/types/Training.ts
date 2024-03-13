import { Player } from "./Player";

export type Training = {
  id: string;
  field: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  cancelled: boolean;
  confirmedPlayers: Player[];
};
