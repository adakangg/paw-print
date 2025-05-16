import { SupabaseClient } from "@supabase/supabase-js"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergies: {
        Row: {
          id: string
          name: string
          pet_id: string
        }
        Insert: {
          id?: string
          name: string
          pet_id: string
        }
        Update: {
          id?: string
          name?: string
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pet"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          datetime: string | null
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          datetime?: string | null
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          datetime?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conditions: {
        Row: {
          description: string | null
          id: string
          name: string
          pet_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          pet_id: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pet"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          date: string
          folder_id: string | null
          id: string
          mimetype: string
          name: string
          path: string
          user_id: string
        }
        Insert: {
          date: string
          folder_id?: string | null
          id?: string
          mimetype: string
          name: string
          path: string
          user_id: string
        }
        Update: {
          date?: string
          folder_id?: string | null
          id?: string
          mimetype?: string
          name?: string
          path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          id: string
          name: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          description: string | null
          dosage: string | null
          id: string
          name: string
          pet_id: string
        }
        Insert: {
          description?: string | null
          dosage?: string | null
          id?: string
          name: string
          pet_id: string
        }
        Update: {
          description?: string | null
          dosage?: string | null
          id?: string
          name?: string
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition: {
        Row: {
          description: string | null
          id: string
          name: string
          pet_id: string
          schedule: Database["public"]["Enums"]["food_schedule_type"]
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          pet_id: string
          schedule?: Database["public"]["Enums"]["food_schedule_type"]
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          pet_id?: string
          schedule?: Database["public"]["Enums"]["food_schedule_type"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_pet"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      personnel: {
        Row: {
          email: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          type: Database["public"]["Enums"]["personnel_type"] | null
          user_id: string
        }
        Insert: {
          email?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          type?: Database["public"]["Enums"]["personnel_type"] | null
          user_id: string
        }
        Update: {
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["personnel_type"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personnel_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          age_unit: Database["public"]["Enums"]["age_unit"] | null
          id: string
          img_path: string | null
          microchip: string | null
          name: string
          notes: string | null
          sex: string | null
          species: Database["public"]["Enums"]["pet_species"]
          sterilized: boolean | null
          user_id: string | null
          weight: number | null
          weight_unit: Database["public"]["Enums"]["weight_unit"] | null
        }
        Insert: {
          age?: number | null
          age_unit?: Database["public"]["Enums"]["age_unit"] | null
          id?: string
          img_path?: string | null
          microchip?: string | null
          name: string
          notes?: string | null
          sex?: string | null
          species?: Database["public"]["Enums"]["pet_species"]
          sterilized?: boolean | null
          user_id?: string | null
          weight?: number | null
          weight_unit?: Database["public"]["Enums"]["weight_unit"] | null
        }
        Update: {
          age?: number | null
          age_unit?: Database["public"]["Enums"]["age_unit"] | null
          id?: string
          img_path?: string | null
          microchip?: string | null
          name?: string
          notes?: string | null
          sex?: string | null
          species?: Database["public"]["Enums"]["pet_species"]
          sterilized?: boolean | null
          user_id?: string | null
          weight?: number | null
          weight_unit?: Database["public"]["Enums"]["weight_unit"] | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          date: string | null
          description: string | null
          id: string
          name: string
          pet_id: string
          type: Database["public"]["Enums"]["procedure_type"] | null
        }
        Insert: {
          date?: string | null
          description?: string | null
          id?: string
          name: string
          pet_id: string
          type?: Database["public"]["Enums"]["procedure_type"] | null
        }
        Update: {
          date?: string | null
          description?: string | null
          id?: string
          name?: string
          pet_id?: string
          type?: Database["public"]["Enums"]["procedure_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pet"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          f_name: string
          id: string
          l_name: string | null
        }
        Insert: {
          email?: string | null
          f_name?: string
          id?: string
          l_name?: string | null
        }
        Update: {
          email?: string | null
          f_name?: string
          id?: string
          l_name?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          completed: boolean | null
          created_at: string | null
          datetime: string
          id: string
          last_reset: string | null
          linked_object_id: string
          linked_object_type: Database["public"]["Enums"]["schedule_object_type"]
          recurrence_rule: string | null
          type: Database["public"]["Enums"]["schedule_type"]
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          datetime: string
          id?: string
          last_reset?: string | null
          linked_object_id: string
          linked_object_type: Database["public"]["Enums"]["schedule_object_type"]
          recurrence_rule?: string | null
          type?: Database["public"]["Enums"]["schedule_type"]
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          datetime?: string
          id?: string
          last_reset?: string | null
          linked_object_id?: string
          linked_object_type?: Database["public"]["Enums"]["schedule_object_type"]
          recurrence_rule?: string | null
          type?: Database["public"]["Enums"]["schedule_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      age_unit: "months" | "years"
      food_schedule_type: "AM" | "PM" | "AM/PM" | "other"
      personnel_type: "vet" | "grooming" | "boarding" | "other" | "daily"
      pet_species:
        | "dog"
        | "cat"
        | "bird"
        | "reptile"
        | "small_animal"
        | "fish"
        | "other"
      procedure_type: "vaccine" | "surgery" | "other"
      schedule_object_type: "medications" | "appointments" | "nutrition"
      schedule_type: "daily" | "weekly" | "once"
      weight_unit: "lbs" | "grams"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_unit: ["months", "years"],
      food_schedule_type: ["AM", "PM", "AM/PM", "other"],
      personnel_type: ["vet", "grooming", "boarding", "other", "daily"],
      pet_species: [
        "dog",
        "cat",
        "bird",
        "reptile",
        "small_animal",
        "fish",
        "other",
      ],
      procedure_type: ["vaccine", "surgery", "other"],
      schedule_object_type: ["medications", "appointments", "nutrition"],
      schedule_type: ["daily", "weekly", "once"],
      weight_unit: ["lbs", "grams"],
    },
  },
} as const

export type TypedSupabaseClient = SupabaseClient<Database>