export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      friend_requests: {
        Row: {
          created_at: string
          from_profile_id: string
          to_profile_id: string
        }
        Insert: {
          created_at?: string
          from_profile_id: string
          to_profile_id: string
        }
        Update: {
          created_at?: string
          from_profile_id?: string
          to_profile_id?: string
        }
      }
      friends: {
        Row: {
          created_at: string
          fist_profile_id: string
          second_profile_id: string
        }
        Insert: {
          created_at?: string
          fist_profile_id: string
          second_profile_id: string
        }
        Update: {
          created_at?: string
          fist_profile_id?: string
          second_profile_id?: string
        }
      }
      game_darts: {
        Row: {
          created_at: string
          game_id: string
          id: string
          multiplier: number
          score_id: string
          value: number
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          multiplier?: number
          score_id: string
          value: number
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          multiplier?: number
          score_id?: string
          value?: number
        }
      }
      game_invites: {
        Row: {
          created_at: string
          from_profile_id: string
          to_profile_id: string
        }
        Insert: {
          created_at?: string
          from_profile_id: string
          to_profile_id: string
        }
        Update: {
          created_at?: string
          from_profile_id?: string
          to_profile_id?: string
        }
      }
      game_keys: {
        Row: {
          created_at: string
          id: string
          key: string
        }
        Insert: {
          created_at?: string
          id: string
          key: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
        }
      }
      game_players: {
        Row: {
          created_at: string
          game_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          profile_id?: string
        }
      }
      game_scores: {
        Row: {
          created_at: string
          game_id: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          profile_id?: string
        }
      }
      game_starters: {
        Row: {
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
        }
      }
      game_types: {
        Row: {
          created_at: string
          id: string
          label: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
        }
      }
      games: {
        Row: {
          created_at: string
          game_type: string
          id: string
          running: boolean
          starting_points: number
        }
        Insert: {
          created_at?: string
          game_type: string
          id?: string
          running?: boolean
          starting_points?: number
        }
        Update: {
          created_at?: string
          game_type?: string
          id?: string
          running?: boolean
          starting_points?: number
        }
      }
      profile_statistics: {
        Row: {
          created_at: string
          id: string
          losses: number
          total_score: number
          total_throws: number
          wins: number
        }
        Insert: {
          created_at?: string
          id: string
          losses: number
          total_score?: number
          total_throws?: number
          wins: number
        }
        Update: {
          created_at?: string
          id?: string
          losses?: number
          total_score?: number
          total_throws?: number
          wins?: number
        }
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          nick_name: string
          profile_picture: string
        }
        Insert: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          nick_name?: string
          profile_picture?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          nick_name?: string
          profile_picture?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
