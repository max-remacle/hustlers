import { create } from 'zustand'

export const useGameStore = create((set) => ({
    games: [],
    updateGames: (games:any) => set((state:any) => ({
        games: games
      }))
  }))