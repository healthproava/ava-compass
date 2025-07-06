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
      agencies: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      agency_members: {
        Row: {
          agency_id: string
          id: string
          invited_at: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["agency_role"]
          status: string
          user_id: string
        }
        Insert: {
          agency_id: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["agency_role"]
          status?: string
          user_id: string
        }
        Update: {
          agency_id?: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["agency_role"]
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_members_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_agencies: {
        Row: {
          address: string | null
          agency_name: string
          created_at: string
          id: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          agency_name: string
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          agency_name?: string
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      agent_appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          sent: boolean | null
          time_before: string
          type: string
          user_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          sent?: boolean | null
          time_before: string
          type: string
          user_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          sent?: boolean | null
          time_before?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_appointment_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agent_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_calendar_connections: {
        Row: {
          access_token: string | null
          connected: boolean | null
          created_at: string
          id: string
          last_synced: string | null
          provider: string
          refresh_token: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected?: boolean | null
          created_at?: string
          id?: string
          last_synced?: string | null
          provider: string
          refresh_token?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected?: boolean | null
          created_at?: string
          id?: string
          last_synced?: string | null
          provider?: string
          refresh_token?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_calendar_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agent_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_profiles: {
        Row: {
          bio: string | null
          communication_preferences: Json | null
          headline: string | null
          notification_preferences: Json | null
          profile_image_url: string | null
          service_locations: string | null
          specializations: string | null
          updated_at: string
          user_id: string
          years_experience: string | null
        }
        Insert: {
          bio?: string | null
          communication_preferences?: Json | null
          headline?: string | null
          notification_preferences?: Json | null
          profile_image_url?: string | null
          service_locations?: string | null
          specializations?: string | null
          updated_at?: string
          user_id: string
          years_experience?: string | null
        }
        Update: {
          bio?: string | null
          communication_preferences?: Json | null
          headline?: string | null
          notification_preferences?: Json | null
          profile_image_url?: string | null
          service_locations?: string | null
          specializations?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "agent_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_todo_items: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_todo_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agent_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_users: {
        Row: {
          agency_id: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          subscription_tier: string | null
          updated_at: string
          work_type: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          subscription_tier?: string | null
          updated_at?: string
          work_type?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          subscription_tier?: string | null
          updated_at?: string
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_agency"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agent_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_admins: {
        Row: {
          created_at: string | null
          id: string
          permissions: Json | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_conversations: {
        Row: {
          conversation_data: Json | null
          conversation_id: string | null
          ended_at: string | null
          id: string
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          conversation_data?: Json | null
          conversation_id?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          conversation_data?: Json | null
          conversation_id?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_email_preferences: {
        Row: {
          created_at: string | null
          facility_updates: boolean | null
          id: string
          marketing: boolean | null
          newsletter: boolean | null
          search_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          facility_updates?: boolean | null
          id?: string
          marketing?: boolean | null
          newsletter?: boolean | null
          search_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          facility_updates?: boolean | null
          id?: string
          marketing?: boolean | null
          newsletter?: boolean | null
          search_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_email_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_facilities: {
        Row: {
          accepted_payers: Json | null
          address: string | null
          amenities: Json | null
          availability: number | null
          capacity: number | null
          care_services: Json | null
          city: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          image_urls: Json | null
          is_active: boolean | null
          latitude: number | null
          license_number: string | null
          longitude: number | null
          name: string
          phone: string | null
          price_max: number | null
          price_min: number | null
          rating: number | null
          state: string | null
          type: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          accepted_payers?: Json | null
          address?: string | null
          amenities?: Json | null
          availability?: number | null
          capacity?: number | null
          care_services?: Json | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          state?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          accepted_payers?: Json | null
          address?: string | null
          amenities?: Json | null
          availability?: number | null
          capacity?: number | null
          care_services?: Json | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          state?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      agentmobile_favorites: {
        Row: {
          created_at: string | null
          facility_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          facility_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          facility_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_favorites_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agentmobile_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_interactions: {
        Row: {
          created_at: string | null
          facility_id: string | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          facility_id?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          facility_id?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_interactions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agentmobile_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          location: string | null
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_searches: {
        Row: {
          created_at: string | null
          id: string
          results_count: number | null
          search_filters: Json | null
          search_query: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentmobile_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "agentmobile_users"
            referencedColumns: ["id"]
          },
        ]
      }
      agentmobile_users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      amenities: {
        Row: {
          category: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          event_type: string | null
          id: string
          meta: Json | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event_type?: string | null
          id?: string
          meta?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string | null
          id?: string
          meta?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_participants: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          id: string
          is_organizer: boolean | null
          participant_email: string
          participant_name: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          is_organizer?: boolean | null
          participant_email: string
          participant_name?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          is_organizer?: boolean | null
          participant_email?: string
          participant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_participants_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string | null
          id: string
          location_type: string | null
          start_time: string | null
          status: string | null
          title: string
          updated_at: string | null
          video_link: string | null
        }
        Insert: {
          appointment_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location_type?: string | null
          start_time?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          video_link?: string | null
        }
        Update: {
          appointment_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location_type?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          video_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ava_conversations: {
        Row: {
          assistant_type: string | null
          created_at: string | null
          id: string
          openai_thread_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assistant_type?: string | null
          created_at?: string | null
          id?: string
          openai_thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assistant_type?: string | null
          created_at?: string | null
          id?: string
          openai_thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ava_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ava_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          role: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ava_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ava_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      care_needs_assessments: {
        Row: {
          cognitive_status: string | null
          created_at: string
          current_mobility: string | null
          id: string
          medical_conditions: string | null
          support_system: string | null
          user_id: string
        }
        Insert: {
          cognitive_status?: string | null
          created_at?: string
          current_mobility?: string | null
          id?: string
          medical_conditions?: string | null
          support_system?: string | null
          user_id: string
        }
        Update: {
          cognitive_status?: string | null
          created_at?: string
          current_mobility?: string | null
          id?: string
          medical_conditions?: string | null
          support_system?: string | null
          user_id?: string
        }
        Relationships: []
      }
      care_services: {
        Row: {
          additional_cost: number
          care_type_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          additional_cost: number
          care_type_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          additional_cost?: number
          care_type_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_services_care_type_id_fkey"
            columns: ["care_type_id"]
            isOneToOne: false
            referencedRelation: "care_type_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      care_type_definitions: {
        Row: {
          base_hourly_rate: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          base_hourly_rate: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          base_hourly_rate?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      care_types: {
        Row: {
          care_type_id: string | null
          created_at: string | null
          description: string | null
          facility_id: string | null
          id: string
          price_max: number | null
          price_min: number | null
          updated_at: string | null
        }
        Insert: {
          care_type_id?: string | null
          created_at?: string | null
          description?: string | null
          facility_id?: string | null
          id?: string
          price_max?: number | null
          price_min?: number | null
          updated_at?: string | null
        }
        Update: {
          care_type_id?: string | null
          created_at?: string | null
          description?: string | null
          facility_id?: string | null
          id?: string
          price_max?: number | null
          price_min?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          agency_id: string | null
          assigned_agent_id: string | null
          care_needs: string[] | null
          created_at: string | null
          diagnosis: string | null
          dob: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          referral_source: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          assigned_agent_id?: string | null
          care_needs?: string[] | null
          created_at?: string | null
          diagnosis?: string | null
          dob?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          referral_source?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          assigned_agent_id?: string | null
          care_needs?: string[] | null
          created_at?: string | null
          diagnosis?: string | null
          dob?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          referral_source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agent_users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Combined Data": {
        Row: {
          accepted_payers: string | null
          address: string | null
          capacity: string | null
          care_services: string | null
          city: string | null
          diagnoses_supported: string | null
          email: string | null
          "Funding Type": string | null
          image_url: string | null
          lat: string | null
          license: string | null
          lng: string | null
          ltc: string | null
          max_range: string | null
          min_range: string | null
          name: string | null
          "Overall Star Rating": string | null
          phone: string | null
          "Quality Rating": string | null
          specials: string | null
          "Staffing Rating": string | null
          state: string | null
          street: string | null
          "Survey Rating": string | null
          tags: string | null
          type: string | null
          uuid: string
          website: string | null
          zip: number | null
        }
        Insert: {
          accepted_payers?: string | null
          address?: string | null
          capacity?: string | null
          care_services?: string | null
          city?: string | null
          diagnoses_supported?: string | null
          email?: string | null
          "Funding Type"?: string | null
          image_url?: string | null
          lat?: string | null
          license?: string | null
          lng?: string | null
          ltc?: string | null
          max_range?: string | null
          min_range?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          state?: string | null
          street?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          type?: string | null
          uuid: string
          website?: string | null
          zip?: number | null
        }
        Update: {
          accepted_payers?: string | null
          address?: string | null
          capacity?: string | null
          care_services?: string | null
          city?: string | null
          diagnoses_supported?: string | null
          email?: string | null
          "Funding Type"?: string | null
          image_url?: string | null
          lat?: string | null
          license?: string | null
          lng?: string | null
          ltc?: string | null
          max_range?: string | null
          min_range?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          state?: string | null
          street?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          type?: string | null
          uuid?: string
          website?: string | null
          zip?: number | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          agent_id: string | null
          commission_amount: number | null
          commission_status: string | null
          created_at: string | null
          id: string
          move_in_date: string | null
          payment_date: string | null
          referral_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          created_at?: string | null
          id?: string
          move_in_date?: string | null
          payment_date?: string | null
          referral_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          created_at?: string | null
          id?: string
          move_in_date?: string | null
          payment_date?: string | null
          referral_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          source: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          agent_id: string | null
          contract_url: string | null
          facility_id: string | null
          id: string
          signed_at: string | null
          status: string | null
        }
        Insert: {
          agent_id?: string | null
          contract_url?: string | null
          facility_id?: string | null
          id?: string
          signed_at?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string | null
          contract_url?: string | null
          facility_id?: string | null
          id?: string
          signed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_logs: {
        Row: {
          conversation_data: Json
          created_at: string
          id: string
          search_query: string | null
          search_triggered: boolean | null
          senior_id: string | null
        }
        Insert: {
          conversation_data: Json
          created_at?: string
          id?: string
          search_query?: string | null
          search_triggered?: boolean | null
          senior_id?: string | null
        }
        Update: {
          conversation_data?: Json
          created_at?: string
          id?: string
          search_query?: string | null
          search_triggered?: boolean | null
          senior_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_logs_senior_id_fkey"
            columns: ["senior_id"]
            isOneToOne: false
            referencedRelation: "seniors"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_shares: {
        Row: {
          created_at: string | null
          document_id: string | null
          id: string
          shared_with_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          shared_with_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          shared_with_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_shared_with_id_fkey"
            columns: ["shared_with_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_public: boolean | null
          owner_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_public?: boolean | null
          owner_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          owner_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          agent_id: string | null
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          available_24_7: boolean | null
          contact_type: string
          created_at: string
          description: string | null
          id: string
          location_specific: string | null
          name: string
          phone: string
        }
        Insert: {
          available_24_7?: boolean | null
          contact_type: string
          created_at?: string
          description?: string | null
          id?: string
          location_specific?: string | null
          name: string
          phone: string
        }
        Update: {
          available_24_7?: boolean | null
          contact_type?: string
          created_at?: string
          description?: string | null
          id?: string
          location_specific?: string | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          accepts_medicaid: boolean | null
          accepts_medicare: boolean | null
          accepts_va_benefits: boolean | null
          address_line1: string | null
          address_line2: string | null
          capacity: number | null
          city: string | null
          created_at: string
          current_availability: number | null
          description: string | null
          email: string | null
          facility_type: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          price_range_max: number | null
          price_range_min: number | null
          rating: number | null
          reviews_count: number | null
          state: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          capacity?: number | null
          city?: string | null
          created_at?: string
          current_availability?: number | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          state?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          capacity?: number | null
          city?: string | null
          created_at?: string
          current_availability?: number | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          state?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      facility: {
        Row: {
          accepts_medicaid: boolean | null
          accepts_medicare: boolean | null
          accepts_va_benefits: boolean | null
          address_line1: string | null
          address_line2: string | null
          available_units: Json | null
          capacity: number | null
          city: string | null
          created_at: string | null
          current_availability: number | null
          data_source: string | null
          description: string | null
          email: string | null
          facility_type: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          latitude: number | null
          license_number: string | null
          license_type: string | null
          longitude: number | null
          name: string
          phone: string | null
          place_id: string | null
          price_range_max: number | null
          price_range_min: number | null
          rating: number | null
          reviews_count: number | null
          state: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          available_units?: Json | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          current_availability?: number | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          license_type?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          place_id?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          available_units?: Json | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          current_availability?: number | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          license_type?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          place_id?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      facility_amenities: {
        Row: {
          amenity_id: string | null
          created_at: string | null
          description: string | null
          facility_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          amenity_id?: string | null
          created_at?: string | null
          description?: string | null
          facility_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          amenity_id?: string | null
          created_at?: string | null
          description?: string | null
          facility_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      facility_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          facility_id: string | null
          id: string
          is_primary: boolean | null
          sort_order: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          facility_id?: string | null
          id?: string
          is_primary?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          facility_id?: string | null
          id?: string
          is_primary?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_images_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_payments: {
        Row: {
          amount: number
          created_at: string | null
          facility_id: string | null
          id: string
          logged_by: string | null
          payment_date: string | null
          placement_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          facility_id?: string | null
          id?: string
          logged_by?: string | null
          payment_date?: string | null
          placement_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          facility_id?: string | null
          id?: string
          logged_by?: string | null
          payment_date?: string | null
          placement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_payments_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_payments_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "placements"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      HH_Hospice: {
        Row: {
          "Account Name": string | null
          CCN: number | null
          "External Facility Id": string
          Phone: string | null
          "Physical City": string | null
          "Physical Latitude": number | null
          "Physical Longitude": number | null
          "Physical State/Province": string | null
          "Physical Street": string | null
          "Physical Zip Code": string | null
          SubType: string | null
          Type: string | null
        }
        Insert: {
          "Account Name"?: string | null
          CCN?: number | null
          "External Facility Id": string
          Phone?: string | null
          "Physical City"?: string | null
          "Physical Latitude"?: number | null
          "Physical Longitude"?: number | null
          "Physical State/Province"?: string | null
          "Physical Street"?: string | null
          "Physical Zip Code"?: string | null
          SubType?: string | null
          Type?: string | null
        }
        Update: {
          "Account Name"?: string | null
          CCN?: number | null
          "External Facility Id"?: string
          Phone?: string | null
          "Physical City"?: string | null
          "Physical Latitude"?: number | null
          "Physical Longitude"?: number | null
          "Physical State/Province"?: string | null
          "Physical Street"?: string | null
          "Physical Zip Code"?: string | null
          SubType?: string | null
          Type?: string | null
        }
        Relationships: []
      }
      Home_Health_Providers: {
        Row: {
          Address: string | null
          "Certification Date": string | null
          "Changes in skin integrity post-acute care: pressure ulcer/injur":
            | string
            | null
          "City/Town": string | null
          "Discharge Function Score": string | null
          "How often patients got better at bathing": string | null
          "How often patients got better at getting in and out of bed":
            | string
            | null
          "How often patients got better at taking their drugs correctly b":
            | string
            | null
          "How often patients got better at walking or moving around":
            | string
            | null
          "How often patients' breathing improved": string | null
          "How often physician-recommended actions to address medication i":
            | string
            | null
          "How often the home health team began their patients' care in a ":
            | string
            | null
          "How often the home health team determined whether patients rece":
            | string
            | null
          Medicare: boolean
          "Offers Home Health Aide Services": string | null
          "Offers Medical Social Services": string | null
          "Offers Nursing Care Services": string | null
          "Offers Occupational Therapy Services": string | null
          "Offers Physical Therapy Services": string | null
          "Offers Speech Pathology Services": string | null
          "Percent of Residents Experiencing One or More Falls with Major ":
            | string
            | null
          "Provider Name": string | null
          "Quality of patient care star rating": string | null
          State: string | null
          "Telephone Number": string | null
          uuid: string
          "ZIP Code": number | null
        }
        Insert: {
          Address?: string | null
          "Certification Date"?: string | null
          "Changes in skin integrity post-acute care: pressure ulcer/injur"?:
            | string
            | null
          "City/Town"?: string | null
          "Discharge Function Score"?: string | null
          "How often patients got better at bathing"?: string | null
          "How often patients got better at getting in and out of bed"?:
            | string
            | null
          "How often patients got better at taking their drugs correctly b"?:
            | string
            | null
          "How often patients got better at walking or moving around"?:
            | string
            | null
          "How often patients' breathing improved"?: string | null
          "How often physician-recommended actions to address medication i"?:
            | string
            | null
          "How often the home health team began their patients' care in a "?:
            | string
            | null
          "How often the home health team determined whether patients rece"?:
            | string
            | null
          Medicare?: boolean
          "Offers Home Health Aide Services"?: string | null
          "Offers Medical Social Services"?: string | null
          "Offers Nursing Care Services"?: string | null
          "Offers Occupational Therapy Services"?: string | null
          "Offers Physical Therapy Services"?: string | null
          "Offers Speech Pathology Services"?: string | null
          "Percent of Residents Experiencing One or More Falls with Major "?:
            | string
            | null
          "Provider Name"?: string | null
          "Quality of patient care star rating"?: string | null
          State?: string | null
          "Telephone Number"?: string | null
          uuid?: string
          "ZIP Code"?: number | null
        }
        Update: {
          Address?: string | null
          "Certification Date"?: string | null
          "Changes in skin integrity post-acute care: pressure ulcer/injur"?:
            | string
            | null
          "City/Town"?: string | null
          "Discharge Function Score"?: string | null
          "How often patients got better at bathing"?: string | null
          "How often patients got better at getting in and out of bed"?:
            | string
            | null
          "How often patients got better at taking their drugs correctly b"?:
            | string
            | null
          "How often patients got better at walking or moving around"?:
            | string
            | null
          "How often patients' breathing improved"?: string | null
          "How often physician-recommended actions to address medication i"?:
            | string
            | null
          "How often the home health team began their patients' care in a "?:
            | string
            | null
          "How often the home health team determined whether patients rece"?:
            | string
            | null
          Medicare?: boolean
          "Offers Home Health Aide Services"?: string | null
          "Offers Medical Social Services"?: string | null
          "Offers Nursing Care Services"?: string | null
          "Offers Occupational Therapy Services"?: string | null
          "Offers Physical Therapy Services"?: string | null
          "Offers Speech Pathology Services"?: string | null
          "Percent of Residents Experiencing One or More Falls with Major "?:
            | string
            | null
          "Provider Name"?: string | null
          "Quality of patient care star rating"?: string | null
          State?: string | null
          "Telephone Number"?: string | null
          uuid?: string
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      "images of providers": {
        Row: {
          "Call to Action Text": string | null
          City: string | null
          "Core Services (comma-separated)": string | null
          "CTA Button 1 Link": string | null
          "CTA Button 1 Text": string | null
          "CTA Button 2 Link": string | null
          "CTA Button 2 Text": string | null
          Description: string | null
          Email: string | null
          "Facility Name": string
          "Image URL 1": string | null
          "Image URL 2": string | null
          "Image URL 3": string | null
          "Lifestyle Amenities (comma-separated)": string | null
          Phone: string | null
          State: string | null
          "Street Address": string | null
          Website: string | null
          "ZIP Code": number | null
        }
        Insert: {
          "Call to Action Text"?: string | null
          City?: string | null
          "Core Services (comma-separated)"?: string | null
          "CTA Button 1 Link"?: string | null
          "CTA Button 1 Text"?: string | null
          "CTA Button 2 Link"?: string | null
          "CTA Button 2 Text"?: string | null
          Description?: string | null
          Email?: string | null
          "Facility Name": string
          "Image URL 1"?: string | null
          "Image URL 2"?: string | null
          "Image URL 3"?: string | null
          "Lifestyle Amenities (comma-separated)"?: string | null
          Phone?: string | null
          State?: string | null
          "Street Address"?: string | null
          Website?: string | null
          "ZIP Code"?: number | null
        }
        Update: {
          "Call to Action Text"?: string | null
          City?: string | null
          "Core Services (comma-separated)"?: string | null
          "CTA Button 1 Link"?: string | null
          "CTA Button 1 Text"?: string | null
          "CTA Button 2 Link"?: string | null
          "CTA Button 2 Text"?: string | null
          Description?: string | null
          Email?: string | null
          "Facility Name"?: string
          "Image URL 1"?: string | null
          "Image URL 2"?: string | null
          "Image URL 3"?: string | null
          "Lifestyle Amenities (comma-separated)"?: string | null
          Phone?: string | null
          State?: string | null
          "Street Address"?: string | null
          Website?: string | null
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      intake_forms: {
        Row: {
          allergies: string | null
          allow_covid_vaccine: boolean | null
          allow_flu_vaccine: boolean | null
          allow_tuberculin_test: boolean | null
          can_be_met_by_facility: boolean | null
          client_id: string | null
          code_status: string | null
          cognitive_status: Json | null
          created_at: string | null
          created_by_user_id: string | null
          dietary_restrictions: string | null
          dnr_directive_active: boolean | null
          facility_name: string | null
          functional_ability: Json | null
          id: string
          level_of_care: string | null
          medication_assistance_level: string | null
          medications: Json | null
          patient_name: string | null
          patient_signature_date: string | null
          patient_signature_url: string | null
          physician_signature_date: string | null
          physician_signature_url: string | null
          primary_diagnosis: string | null
          reason_for_visit: string | null
          secondary_diagnosis: string | null
          status: string | null
          updated_at: string | null
          vitals: Json | null
        }
        Insert: {
          allergies?: string | null
          allow_covid_vaccine?: boolean | null
          allow_flu_vaccine?: boolean | null
          allow_tuberculin_test?: boolean | null
          can_be_met_by_facility?: boolean | null
          client_id?: string | null
          code_status?: string | null
          cognitive_status?: Json | null
          created_at?: string | null
          created_by_user_id?: string | null
          dietary_restrictions?: string | null
          dnr_directive_active?: boolean | null
          facility_name?: string | null
          functional_ability?: Json | null
          id?: string
          level_of_care?: string | null
          medication_assistance_level?: string | null
          medications?: Json | null
          patient_name?: string | null
          patient_signature_date?: string | null
          patient_signature_url?: string | null
          physician_signature_date?: string | null
          physician_signature_url?: string | null
          primary_diagnosis?: string | null
          reason_for_visit?: string | null
          secondary_diagnosis?: string | null
          status?: string | null
          updated_at?: string | null
          vitals?: Json | null
        }
        Update: {
          allergies?: string | null
          allow_covid_vaccine?: boolean | null
          allow_flu_vaccine?: boolean | null
          allow_tuberculin_test?: boolean | null
          can_be_met_by_facility?: boolean | null
          client_id?: string | null
          code_status?: string | null
          cognitive_status?: Json | null
          created_at?: string | null
          created_by_user_id?: string | null
          dietary_restrictions?: string | null
          dnr_directive_active?: boolean | null
          facility_name?: string | null
          functional_ability?: Json | null
          id?: string
          level_of_care?: string | null
          medication_assistance_level?: string | null
          medications?: Json | null
          patient_name?: string | null
          patient_signature_date?: string | null
          patient_signature_url?: string | null
          physician_signature_date?: string | null
          physician_signature_url?: string | null
          primary_diagnosis?: string | null
          reason_for_visit?: string | null
          secondary_diagnosis?: string | null
          status?: string | null
          updated_at?: string | null
          vitals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "intake_forms_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          contact_id: string | null
          content: string | null
          created_at: string
          facility_id: string | null
          follow_up_date: string | null
          id: string
          interaction_date: string | null
          status: string | null
          subject: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          contact_id?: string | null
          content?: string | null
          created_at?: string
          facility_id?: string | null
          follow_up_date?: string | null
          id?: string
          interaction_date?: string | null
          status?: string | null
          subject?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string | null
          content?: string | null
          created_at?: string
          facility_id?: string | null
          follow_up_date?: string | null
          id?: string
          interaction_date?: string | null
          status?: string | null
          subject?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          quantity: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          quantity: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          from_user_id: string | null
          id: string
          invoice_id: string | null
          paid_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          from_user_id?: string | null
          id?: string
          invoice_id?: string | null
          paid_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          from_user_id?: string | null
          id?: string
          invoice_id?: string | null
          paid_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          from_user_id: string | null
          id: string
          invoice_number: string | null
          paid_date: string | null
          status: string | null
          to_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          from_user_id?: string | null
          id?: string
          invoice_number?: string | null
          paid_date?: string | null
          status?: string | null
          to_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          from_user_id?: string | null
          id?: string
          invoice_number?: string | null
          paid_date?: string | null
          status?: string | null
          to_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      location_multipliers: {
        Row: {
          city: string
          cost_multiplier: number
          created_at: string
          id: string
          state: string
        }
        Insert: {
          city: string
          cost_multiplier?: number
          created_at?: string
          id?: string
          state: string
        }
        Update: {
          city?: string
          cost_multiplier?: number
          created_at?: string
          id?: string
          state?: string
        }
        Relationships: []
      }
      medical_supply_companies: {
        Row: {
          acceptsassignement: boolean | null
          businessname: string | null
          is_contracted_for_cba: boolean | null
          latitude: number | null
          longitude: number | null
          practiceaddress1: string | null
          practiceaddress2: string | null
          practicecity: string | null
          practicename: string | null
          practicestate: string | null
          practicezip9code: number | null
          provider_id: number
          providertypelist: string | null
          specialitieslist: string | null
          supplieslist: string | null
          telephonenumber: number | null
          uuid: string
        }
        Insert: {
          acceptsassignement?: boolean | null
          businessname?: string | null
          is_contracted_for_cba?: boolean | null
          latitude?: number | null
          longitude?: number | null
          practiceaddress1?: string | null
          practiceaddress2?: string | null
          practicecity?: string | null
          practicename?: string | null
          practicestate?: string | null
          practicezip9code?: number | null
          provider_id: number
          providertypelist?: string | null
          specialitieslist?: string | null
          supplieslist?: string | null
          telephonenumber?: number | null
          uuid?: string
        }
        Update: {
          acceptsassignement?: boolean | null
          businessname?: string | null
          is_contracted_for_cba?: boolean | null
          latitude?: number | null
          longitude?: number | null
          practiceaddress1?: string | null
          practiceaddress2?: string | null
          practicecity?: string | null
          practicename?: string | null
          practicestate?: string | null
          practicezip9code?: number | null
          provider_id?: number
          providertypelist?: string | null
          specialitieslist?: string | null
          supplieslist?: string | null
          telephonenumber?: number | null
          uuid?: string
        }
        Relationships: []
      }
      merged_facilities: {
        Row: {
          accepts_medicaid: boolean | null
          accepts_medicare: boolean | null
          accepts_va_benefits: boolean | null
          address_line1: string | null
          address_line2: string | null
          amenities: Json | null
          business_hours: Json | null
          capacity: number | null
          city: string | null
          created_at: string | null
          current_availability: number | null
          data_source: string | null
          description: string | null
          email: string | null
          facility_type: string | null
          id: string
          image_urls: Json | null
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          license_number: string | null
          license_type: string | null
          longitude: number | null
          name: string
          original_id: string | null
          phone: string | null
          price_range_max: number | null
          price_range_min: number | null
          rating: number | null
          reviews_count: number | null
          services: Json | null
          state: string | null
          updated_at: string | null
          virtual_tour_url: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          amenities?: Json | null
          business_hours?: Json | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          current_availability?: number | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          license_type?: string | null
          longitude?: number | null
          name: string
          original_id?: string | null
          phone?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          services?: Json | null
          state?: string | null
          updated_at?: string | null
          virtual_tour_url?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          amenities?: Json | null
          business_hours?: Json | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          current_availability?: number | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          license_type?: string | null
          longitude?: number | null
          name?: string
          original_id?: string | null
          phone?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          services?: Json | null
          state?: string | null
          updated_at?: string | null
          virtual_tour_url?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          id: string
          receiver_id: string | null
          sender_id: string | null
          timestamp: string | null
        }
        Insert: {
          body?: string | null
          id?: string
          receiver_id?: string | null
          sender_id?: string | null
          timestamp?: string | null
        }
        Update: {
          body?: string | null
          id?: string
          receiver_id?: string | null
          sender_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      nationwide_facilities: {
        Row: {
          "Abuse Icon": string | null
          "Affiliated Entity ID": string | null
          "Affiliated Entity Name": string | null
          "Average Number of Residents per Day": number | null
          "City/Town": string | null
          "CMS Certification Number (CCN)": string | null
          "Continuing Care Retirement Community": string | null
          "County/Parish": string | null
          "Date First Approved to Provide Medicare and Medicaid Services":
            | string
            | null
          "Health Inspection Rating": string | null
          Latitude: number | null
          "Legal Business Name": string | null
          Location: string | null
          Longitude: number | null
          "Number of Certified Beds": string | null
          "Number of Citations from Infection Control Inspections":
            | string
            | null
          "Number of Facility Reported Incidents": string | null
          "Number of Fines": string | null
          "Number of Substantiated Complaints": string | null
          "Overall Rating": string | null
          "Provider Address": string | null
          "Provider Name": string | null
          "Provider SSA County Code": string | null
          "Provider Type": string | null
          "QM Rating": string | null
          "QM Rating Footnote": string | null
          "Special Focus Status": string | null
          "Staffing Rating": number | null
          State: string | null
          "Telephone Number": number | null
          "Total Amount of Fines in Dollars": string | null
          "Total Number of Penalties": string | null
          UUID: string
          "ZIP Code": number | null
        }
        Insert: {
          "Abuse Icon"?: string | null
          "Affiliated Entity ID"?: string | null
          "Affiliated Entity Name"?: string | null
          "Average Number of Residents per Day"?: number | null
          "City/Town"?: string | null
          "CMS Certification Number (CCN)"?: string | null
          "Continuing Care Retirement Community"?: string | null
          "County/Parish"?: string | null
          "Date First Approved to Provide Medicare and Medicaid Services"?:
            | string
            | null
          "Health Inspection Rating"?: string | null
          Latitude?: number | null
          "Legal Business Name"?: string | null
          Location?: string | null
          Longitude?: number | null
          "Number of Certified Beds"?: string | null
          "Number of Citations from Infection Control Inspections"?:
            | string
            | null
          "Number of Facility Reported Incidents"?: string | null
          "Number of Fines"?: string | null
          "Number of Substantiated Complaints"?: string | null
          "Overall Rating"?: string | null
          "Provider Address"?: string | null
          "Provider Name"?: string | null
          "Provider SSA County Code"?: string | null
          "Provider Type"?: string | null
          "QM Rating"?: string | null
          "QM Rating Footnote"?: string | null
          "Special Focus Status"?: string | null
          "Staffing Rating"?: number | null
          State?: string | null
          "Telephone Number"?: number | null
          "Total Amount of Fines in Dollars"?: string | null
          "Total Number of Penalties"?: string | null
          UUID?: string
          "ZIP Code"?: number | null
        }
        Update: {
          "Abuse Icon"?: string | null
          "Affiliated Entity ID"?: string | null
          "Affiliated Entity Name"?: string | null
          "Average Number of Residents per Day"?: number | null
          "City/Town"?: string | null
          "CMS Certification Number (CCN)"?: string | null
          "Continuing Care Retirement Community"?: string | null
          "County/Parish"?: string | null
          "Date First Approved to Provide Medicare and Medicaid Services"?:
            | string
            | null
          "Health Inspection Rating"?: string | null
          Latitude?: number | null
          "Legal Business Name"?: string | null
          Location?: string | null
          Longitude?: number | null
          "Number of Certified Beds"?: string | null
          "Number of Citations from Infection Control Inspections"?:
            | string
            | null
          "Number of Facility Reported Incidents"?: string | null
          "Number of Fines"?: string | null
          "Number of Substantiated Complaints"?: string | null
          "Overall Rating"?: string | null
          "Provider Address"?: string | null
          "Provider Name"?: string | null
          "Provider SSA County Code"?: string | null
          "Provider Type"?: string | null
          "QM Rating"?: string | null
          "QM Rating Footnote"?: string | null
          "Special Focus Status"?: string | null
          "Staffing Rating"?: number | null
          State?: string | null
          "Telephone Number"?: number | null
          "Total Amount of Fines in Dollars"?: string | null
          "Total Number of Penalties"?: string | null
          UUID?: string
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_type: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      placements: {
        Row: {
          agent_commission_percentage: number | null
          agent_id: string | null
          commission_amount: number | null
          commission_status:
            | Database["public"]["Enums"]["commission_status"]
            | null
          created_at: string | null
          facility_id: string | null
          first_month_rent_fee: number | null
          hpa_revenue: number | null
          hpa_revenue_percentage: number | null
          id: string
          monthly_rent: number | null
          placement_date: string | null
          senior_id: string | null
          status: Database["public"]["Enums"]["placement_status"] | null
          updated_at: string | null
        }
        Insert: {
          agent_commission_percentage?: number | null
          agent_id?: string | null
          commission_amount?: number | null
          commission_status?:
            | Database["public"]["Enums"]["commission_status"]
            | null
          created_at?: string | null
          facility_id?: string | null
          first_month_rent_fee?: number | null
          hpa_revenue?: number | null
          hpa_revenue_percentage?: number | null
          id?: string
          monthly_rent?: number | null
          placement_date?: string | null
          senior_id?: string | null
          status?: Database["public"]["Enums"]["placement_status"] | null
          updated_at?: string | null
        }
        Update: {
          agent_commission_percentage?: number | null
          agent_id?: string | null
          commission_amount?: number | null
          commission_status?:
            | Database["public"]["Enums"]["commission_status"]
            | null
          created_at?: string | null
          facility_id?: string | null
          first_month_rent_fee?: number | null
          hpa_revenue?: number | null
          hpa_revenue_percentage?: number | null
          id?: string
          monthly_rent?: number | null
          placement_date?: string | null
          senior_id?: string | null
          status?: Database["public"]["Enums"]["placement_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "placements_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_senior_id_fkey"
            columns: ["senior_id"]
            isOneToOne: false
            referencedRelation: "seniors"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_milestones: {
        Row: {
          completed: boolean | null
          created_at: string
          estimated_date: string | null
          id: string
          milestone_id: string | null
          tasks: string | null
          timeline_plan_id: string | null
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          estimated_date?: string | null
          id?: string
          milestone_id?: string | null
          tasks?: string | null
          timeline_plan_id?: string | null
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          estimated_date?: string | null
          id?: string
          milestone_id?: string | null
          tasks?: string | null
          timeline_plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "timeline_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_milestones_timeline_plan_id_fkey"
            columns: ["timeline_plan_id"]
            isOneToOne: false
            referencedRelation: "timeline_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          client_id: string | null
          id: string
          intake_form_url: string | null
          received_at: string | null
          referred_by_user_id: string | null
          status: string
          submitted_by: string | null
        }
        Insert: {
          client_id?: string | null
          id?: string
          intake_form_url?: string | null
          received_at?: string | null
          referred_by_user_id?: string | null
          status: string
          submitted_by?: string | null
        }
        Update: {
          client_id?: string | null
          id?: string
          intake_form_url?: string | null
          received_at?: string | null
          referred_by_user_id?: string | null
          status?: string
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      search_conversation_summaries: {
        Row: {
          created_at: string
          id: string
          markup_content: string
          search_result_id: string | null
          summary_text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          markup_content: string
          search_result_id?: string | null
          summary_text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          markup_content?: string
          search_result_id?: string | null
          summary_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_conversation_summaries_search_result_id_fkey"
            columns: ["search_result_id"]
            isOneToOne: false
            referencedRelation: "serperapi_search_results"
            referencedColumns: ["id"]
          },
        ]
      }
      search_results: {
        Row: {
          created_at: string
          id: string
          query: string
          results: Json
          senior_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          results: Json
          senior_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          results?: Json
          senior_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_results_senior_id_fkey"
            columns: ["senior_id"]
            isOneToOne: false
            referencedRelation: "seniors"
            referencedColumns: ["id"]
          },
        ]
      }
      senior_care_providers: {
        Row: {
          "City/Town": string | null
          Latitude: number | null
          Longitude: number | null
          Medicare: boolean
          "Provider Address": string | null
          "Provider Name": string | null
          "Telephone Number": number | null
          UUID: string
        }
        Insert: {
          "City/Town"?: string | null
          Latitude?: number | null
          Longitude?: number | null
          Medicare?: boolean
          "Provider Address"?: string | null
          "Provider Name"?: string | null
          "Telephone Number"?: number | null
          UUID?: string
        }
        Update: {
          "City/Town"?: string | null
          Latitude?: number | null
          Longitude?: number | null
          Medicare?: boolean
          "Provider Address"?: string | null
          "Provider Name"?: string | null
          "Telephone Number"?: number | null
          UUID?: string
        }
        Relationships: []
      }
      seniors: {
        Row: {
          additional_preferences: Json | null
          age: number
          budget_max: number | null
          budget_min: number | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          medical_needs: string[] | null
          name: string
          preferred_location: string | null
          updated_at: string
        }
        Insert: {
          additional_preferences?: Json | null
          age: number
          budget_max?: number | null
          budget_min?: number | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          medical_needs?: string[] | null
          name: string
          preferred_location?: string | null
          updated_at?: string
        }
        Update: {
          additional_preferences?: Json | null
          age?: number
          budget_max?: number | null
          budget_min?: number | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          medical_needs?: string[] | null
          name?: string
          preferred_location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      serperapi_places: {
        Row: {
          address: string | null
          cid: string | null
          created_at: string
          external_uuid: string | null
          fid: string | null
          id: string
          latitude: number | null
          longitude: number | null
          opening_hours: Json | null
          phone_number: string | null
          place_id: string | null
          place_type: string | null
          place_types: Json | null
          position: number | null
          rating: number | null
          rating_count: number | null
          search_result_id: string | null
          thumbnail_url: string | null
          title: string
          website: string | null
        }
        Insert: {
          address?: string | null
          cid?: string | null
          created_at?: string
          external_uuid?: string | null
          fid?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          phone_number?: string | null
          place_id?: string | null
          place_type?: string | null
          place_types?: Json | null
          position?: number | null
          rating?: number | null
          rating_count?: number | null
          search_result_id?: string | null
          thumbnail_url?: string | null
          title: string
          website?: string | null
        }
        Update: {
          address?: string | null
          cid?: string | null
          created_at?: string
          external_uuid?: string | null
          fid?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          phone_number?: string | null
          place_id?: string | null
          place_type?: string | null
          place_types?: Json | null
          position?: number | null
          rating?: number | null
          rating_count?: number | null
          search_result_id?: string | null
          thumbnail_url?: string | null
          title?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "serperapi_places_search_result_id_fkey"
            columns: ["search_result_id"]
            isOneToOne: false
            referencedRelation: "serperapi_search_results"
            referencedColumns: ["id"]
          },
        ]
      }
      serperapi_raw_results: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          parsing_status: string | null
          raw_json_data: Json
          user_search_request_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          parsing_status?: string | null
          raw_json_data: Json
          user_search_request_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          parsing_status?: string | null
          raw_json_data?: Json
          user_search_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "serpapi_raw_results_user_search_request_id_fkey"
            columns: ["user_search_request_id"]
            isOneToOne: false
            referencedRelation: "user_search_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      serperapi_search_results: {
        Row: {
          created_at: string
          id: string
          raw_response: Json
          search_parameters: Json | null
          search_query: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          raw_response: Json
          search_parameters?: Json | null
          search_query: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          raw_response?: Json
          search_parameters?: Json | null
          search_query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      specialist_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          senior_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          senior_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          senior_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specialist_notes_senior_id_fkey"
            columns: ["senior_id"]
            isOneToOne: false
            referencedRelation: "seniors"
            referencedColumns: ["id"]
          },
        ]
      }
      squarespace_commerce: {
        Row: {
          category: string | null
          created_at: string | null
          id: number
          inventory_count: number
          price: number
          product_description: string | null
          product_name: string
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: never
          inventory_count: number
          price: number
          product_description?: string | null
          product_name: string
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: never
          inventory_count?: number
          price?: number
          product_description?: string | null
          product_name?: string
          sku?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Storepoint: {
        Row: {
          address: string | null
          capacity: string | null
          city: string | null
          email: string | null
          image_url: string | null
          lat: string | null
          lng: string | null
          name: string | null
          phone: string | null
          reviews: string | null
          state: string | null
          street: string | null
          type: string | null
          website: string | null
          zip: number | null
        }
        Insert: {
          address?: string | null
          capacity?: string | null
          city?: string | null
          email?: string | null
          image_url?: string | null
          lat?: string | null
          lng?: string | null
          name?: string | null
          phone?: string | null
          reviews?: string | null
          state?: string | null
          street?: string | null
          type?: string | null
          website?: string | null
          zip?: number | null
        }
        Update: {
          address?: string | null
          capacity?: string | null
          city?: string | null
          email?: string | null
          image_url?: string | null
          lat?: string | null
          lng?: string | null
          name?: string | null
          phone?: string | null
          reviews?: string | null
          state?: string | null
          street?: string | null
          type?: string | null
          website?: string | null
          zip?: number | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_customer_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_subscription_id: string
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status: string
          stripe_subscription_id: string
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribed: {
        Row: {
          "Call to Action Text": string | null
          City: string | null
          "Core Services (comma-separated)": string | null
          "CTA Button 1 Link": string | null
          "CTA Button 1 Text": string | null
          "CTA Button 2 Link": string | null
          "CTA Button 2 Text": string | null
          Description: string | null
          Email: string | null
          "Facility Name": string | null
          "Image URL 1": string | null
          "Image URL 2": string | null
          "Image URL 3": string | null
          "Lifestyle Amenities (comma-separated)": string | null
          Map: string | null
          Phone: string | null
          State: string | null
          "Street Address": string | null
          uuid: string
          Website: string | null
          "ZIP Code": number | null
        }
        Insert: {
          "Call to Action Text"?: string | null
          City?: string | null
          "Core Services (comma-separated)"?: string | null
          "CTA Button 1 Link"?: string | null
          "CTA Button 1 Text"?: string | null
          "CTA Button 2 Link"?: string | null
          "CTA Button 2 Text"?: string | null
          Description?: string | null
          Email?: string | null
          "Facility Name"?: string | null
          "Image URL 1"?: string | null
          "Image URL 2"?: string | null
          "Image URL 3"?: string | null
          "Lifestyle Amenities (comma-separated)"?: string | null
          Map?: string | null
          Phone?: string | null
          State?: string | null
          "Street Address"?: string | null
          uuid?: string
          Website?: string | null
          "ZIP Code"?: number | null
        }
        Update: {
          "Call to Action Text"?: string | null
          City?: string | null
          "Core Services (comma-separated)"?: string | null
          "CTA Button 1 Link"?: string | null
          "CTA Button 1 Text"?: string | null
          "CTA Button 2 Link"?: string | null
          "CTA Button 2 Text"?: string | null
          Description?: string | null
          Email?: string | null
          "Facility Name"?: string | null
          "Image URL 1"?: string | null
          "Image URL 2"?: string | null
          "Image URL 3"?: string | null
          "Lifestyle Amenities (comma-separated)"?: string | null
          Map?: string | null
          Phone?: string | null
          State?: string | null
          "Street Address"?: string | null
          uuid?: string
          Website?: string | null
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      subscription_features: {
        Row: {
          created_at: string | null
          feature_id: string | null
          id: string
          tier: string
        }
        Insert: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          tier: string
        }
        Update: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          tier: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          tier?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          tier?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          contact_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          facility_id: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          facility_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          facility_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_milestones: {
        Row: {
          care_level_required: string | null
          created_at: string
          description: string | null
          estimated_timeframe: string | null
          id: string
          name: string
          task_template: string | null
        }
        Insert: {
          care_level_required?: string | null
          created_at?: string
          description?: string | null
          estimated_timeframe?: string | null
          id?: string
          name: string
          task_template?: string | null
        }
        Update: {
          care_level_required?: string | null
          created_at?: string
          description?: string | null
          estimated_timeframe?: string | null
          id?: string
          name?: string
          task_template?: string | null
        }
        Relationships: []
      }
      timeline_plans: {
        Row: {
          assessment_id: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_plans_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "care_needs_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          created_at: string
          facility_id: string | null
          id: string
          is_virtual: boolean | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          senior_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          facility_id?: string | null
          id?: string
          is_virtual?: boolean | null
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          senior_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          facility_id?: string | null
          id?: string
          is_virtual?: boolean | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          senior_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_senior_id_fkey"
            columns: ["senior_id"]
            isOneToOne: false
            referencedRelation: "seniors"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_facilities: {
        Row: {
          accepts_medicaid: boolean | null
          accepts_medicare: boolean | null
          accepts_va_benefits: boolean | null
          address_line1: string | null
          address_line2: string | null
          amenities: Json | null
          business_hours: Json | null
          capacity: number | null
          city: string | null
          created_at: string | null
          current_availability: number | null
          data_source: string | null
          description: string | null
          email: string | null
          facility_type: string | null
          id: string
          image_urls: Json | null
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          license_number: string | null
          license_type: string | null
          longitude: number | null
          name: string
          original_id: string | null
          phone: string | null
          price_range_max: number | null
          price_range_min: number | null
          rating: number | null
          reviews_count: number | null
          services: Json | null
          state: string | null
          updated_at: string | null
          virtual_tour_url: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          amenities?: Json | null
          business_hours?: Json | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          current_availability?: number | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          license_type?: string | null
          longitude?: number | null
          name: string
          original_id?: string | null
          phone?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          services?: Json | null
          state?: string | null
          updated_at?: string | null
          virtual_tour_url?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_medicaid?: boolean | null
          accepts_medicare?: boolean | null
          accepts_va_benefits?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          amenities?: Json | null
          business_hours?: Json | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          current_availability?: number | null
          data_source?: string | null
          description?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          license_type?: string | null
          longitude?: number | null
          name?: string
          original_id?: string | null
          phone?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          rating?: number | null
          reviews_count?: number | null
          services?: Json | null
          state?: string | null
          updated_at?: string | null
          virtual_tour_url?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      "updated providers may 2025": {
        Row: {
          Address: string | null
          City: string | null
          "Facility Name": string | null
          "Internal ID": string
          "License ID": string | null
          Source: string | null
          State: string | null
          Zip: number | null
        }
        Insert: {
          Address?: string | null
          City?: string | null
          "Facility Name"?: string | null
          "Internal ID": string
          "License ID"?: string | null
          Source?: string | null
          State?: string | null
          Zip?: number | null
        }
        Update: {
          Address?: string | null
          City?: string | null
          "Facility Name"?: string | null
          "Internal ID"?: string
          "License ID"?: string | null
          Source?: string | null
          State?: string | null
          Zip?: number | null
        }
        Relationships: []
      }
      user_emergency_contacts: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          facility_id: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string | null
          generate_document_summary: Json | null
          send_results_summary: Json | null
          send_user_intent_summary: Json | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          generate_document_summary?: Json | null
          send_results_summary?: Json | null
          send_user_intent_summary?: Json | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          generate_document_summary?: Json | null
          send_results_summary?: Json | null
          send_user_intent_summary?: Json | null
          uuid?: string
        }
        Relationships: []
      }
      user_profile_end_user: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          budget_range: Database["public"]["Enums"]["budget_range"] | null
          care_needs: Json | null
          care_recepient_relationship:
            | Database["public"]["Enums"]["care_recepient_relationship"]
            | null
          care_urgency: Database["public"]["Enums"]["care_urgency"] | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          id: string
          medical_conditions: Json | null
          preferred_amenities: Json | null
          state: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          budget_range?: Database["public"]["Enums"]["budget_range"] | null
          care_needs?: Json | null
          care_recepient_relationship?:
            | Database["public"]["Enums"]["care_recepient_relationship"]
            | null
          care_urgency?: Database["public"]["Enums"]["care_urgency"] | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          medical_conditions?: Json | null
          preferred_amenities?: Json | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          budget_range?: Database["public"]["Enums"]["budget_range"] | null
          care_needs?: Json | null
          care_recepient_relationship?:
            | Database["public"]["Enums"]["care_recepient_relationship"]
            | null
          care_urgency?: Database["public"]["Enums"]["care_urgency"] | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          medical_conditions?: Json | null
          preferred_amenities?: Json | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_end_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_facility_admin: {
        Row: {
          admin_level: string | null
          created_at: string
          department: string | null
          id: string
          job_title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_level?: string | null
          created_at?: string
          department?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_level?: string | null
          created_at?: string
          department?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_facility_admin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_professional: {
        Row: {
          bio: string | null
          created_at: string
          geographical_service_area: Json | null
          id: string
          license_number: string | null
          license_state: string | null
          professional_title: string | null
          specialities: Json | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          geographical_service_area?: Json | null
          id?: string
          license_number?: string | null
          license_state?: string | null
          professional_title?: string | null
          specialities?: Json | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          geographical_service_area?: Json | null
          id?: string
          license_number?: string | null
          license_state?: string | null
          professional_title?: string | null
          specialities?: Json | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_professional_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_search_requests: {
        Row: {
          agent_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          search_criteria: Json
          serpapi_query_sent: string | null
          status: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          search_criteria: Json
          serpapi_query_sent?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          search_criteria?: Json
          serpapi_query_sent?: string | null
          status?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login: string | null
          last_name: string | null
          mfa_enabled: boolean | null
          organization: string | null
          password_hash: string | null
          phone: string | null
          profile_image_url: string | null
          role: string
          tier: string
          updated_at: string | null
          veteran_status: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          mfa_enabled?: boolean | null
          organization?: string | null
          password_hash?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role: string
          tier: string
          updated_at?: string | null
          veteran_status?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          mfa_enabled?: boolean | null
          organization?: string | null
          password_hash?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string
          tier?: string
          updated_at?: string | null
          veteran_status?: boolean | null
        }
        Relationships: []
      }
      VA_Providers: {
        Row: {
          Address: string | null
          "City/Town": string | null
          "County/Parish": string | null
          "Emergency Services": string | null
          "Facility ID": string | null
          "Facility Name": string | null
          "Hospital overall rating": string | null
          "Hospital overall rating footnote": string | null
          "Hospital Ownership": string | null
          "Hospital Type": string | null
          State: string | null
          "Telephone Number": string | null
          "ZIP Code": number | null
        }
        Insert: {
          Address?: string | null
          "City/Town"?: string | null
          "County/Parish"?: string | null
          "Emergency Services"?: string | null
          "Facility ID"?: string | null
          "Facility Name"?: string | null
          "Hospital overall rating"?: string | null
          "Hospital overall rating footnote"?: string | null
          "Hospital Ownership"?: string | null
          "Hospital Type"?: string | null
          State?: string | null
          "Telephone Number"?: string | null
          "ZIP Code"?: number | null
        }
        Update: {
          Address?: string | null
          "City/Town"?: string | null
          "County/Parish"?: string | null
          "Emergency Services"?: string | null
          "Facility ID"?: string | null
          "Facility Name"?: string | null
          "Hospital overall rating"?: string | null
          "Hospital overall rating footnote"?: string | null
          "Hospital Ownership"?: string | null
          "Hospital Type"?: string | null
          State?: string | null
          "Telephone Number"?: string | null
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      widget_commands: {
        Row: {
          command_data: Json
          command_type: string
          created_at: string
          id: string
          processed: boolean
          user_id: string | null
        }
        Insert: {
          command_data: Json
          command_type: string
          created_at?: string
          id?: string
          processed?: boolean
          user_id?: string | null
        }
        Update: {
          command_data?: Json
          command_type?: string
          created_at?: string
          id?: string
          processed?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      widget_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          user_id: string | null
          widget_command_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          user_id?: string | null
          widget_command_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          user_id?: string | null
          widget_command_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_interactions_widget_command_id_fkey"
            columns: ["widget_command_id"]
            isOneToOne: false
            referencedRelation: "widget_commands"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: {
          user_id: string
          date_of_birth: string
          address_line_1: string
          address_line_2: string
          city: string
          state: string
          zip_code: string
          care_recepient_relationship: Database["public"]["Enums"]["care_recepient_relationship"]
          care_urgency: Database["public"]["Enums"]["care_urgency"]
          budget_range: Database["public"]["Enums"]["budget_range"]
          care_needs: Json
          medical_conditions: Json
          preferred_amenities: Json
        }
        Returns: undefined
      }
      has_agency_role: {
        Args: {
          _user_id: string
          _agency_id: string
          _role: Database["public"]["Enums"]["agency_role"]
        }
        Returns: boolean
      }
      has_app_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      insert_serperapi_raw_result: {
        Args: {
          user_search_request_id: string
          raw_json_data: Json
          parsing_status?: string
          error_message?: string
        }
        Returns: string
      }
      insert_user_interaction: {
        Args: {
          user_intent_summary: Json
          results_summary: Json
          document_summary: Json
        }
        Returns: {
          uuid: string
          confirmation_message: string
        }[]
      }
      parse_google_maps_results: {
        Args: { raw_results: Json }
        Returns: undefined
      }
      split_name: {
        Args: { full_name: string }
        Returns: {
          first_name: string
          last_name: string
        }[]
      }
    }
    Enums: {
      agency_role: "owner" | "admin" | "agent" | "viewer"
      app_role: "admin" | "moderator" | "user"
      appointment_type: "consultation" | "tour" | "follow_up"
      budget_range:
        | "$2,000 - $4,000"
        | "$4,000 - $6,000"
        | "$6,000 - $8,000"
        | "$8,000 - $10,000+"
        | "sliding_scale"
        | "other"
      care_recepient_relationship:
        | "family"
        | "friend"
        | "medical_professional"
        | "spouse"
        | "child"
      care_urgency: "immediate" | "2_weeks" | "30_days" | "6_months" | "1_year"
      commission_status: "pending" | "paid" | "cancelled"
      contract_status_enum:
        | "PENDING_SIGNATURE"
        | "ACTIVE"
        | "EXPIRED"
        | "INACTIVE"
      invoice_status_enum:
        | "DRAFT"
        | "SUBMITTED"
        | "PROCESSING_HPA"
        | "PAID_HPA"
        | "SENT_TO_FACILITY"
        | "PAID_BY_FACILITY"
        | "OVERDUE"
        | "CANCELLED"
      invoice_type_enum: "HPA" | "FACILITY"
      location_type: "in_person" | "video" | "phone"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      placement_status: "pending" | "confirmed" | "completed" | "canceled"
      role: "end_user" | "professional" | "facility_admin"
      subscription_status: "active" | "past_due" | "canceled" | "trialing"
      subscription_tier: "essentials" | "elevate" | "pinnacle" | "enterprise"
      user_role:
        | "end_user"
        | "professional"
        | "facility_admin"
        | "placement_agent"
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
      agency_role: ["owner", "admin", "agent", "viewer"],
      app_role: ["admin", "moderator", "user"],
      appointment_type: ["consultation", "tour", "follow_up"],
      budget_range: [
        "$2,000 - $4,000",
        "$4,000 - $6,000",
        "$6,000 - $8,000",
        "$8,000 - $10,000+",
        "sliding_scale",
        "other",
      ],
      care_recepient_relationship: [
        "family",
        "friend",
        "medical_professional",
        "spouse",
        "child",
      ],
      care_urgency: ["immediate", "2_weeks", "30_days", "6_months", "1_year"],
      commission_status: ["pending", "paid", "cancelled"],
      contract_status_enum: [
        "PENDING_SIGNATURE",
        "ACTIVE",
        "EXPIRED",
        "INACTIVE",
      ],
      invoice_status_enum: [
        "DRAFT",
        "SUBMITTED",
        "PROCESSING_HPA",
        "PAID_HPA",
        "SENT_TO_FACILITY",
        "PAID_BY_FACILITY",
        "OVERDUE",
        "CANCELLED",
      ],
      invoice_type_enum: ["HPA", "FACILITY"],
      location_type: ["in_person", "video", "phone"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      placement_status: ["pending", "confirmed", "completed", "canceled"],
      role: ["end_user", "professional", "facility_admin"],
      subscription_status: ["active", "past_due", "canceled", "trialing"],
      subscription_tier: ["essentials", "elevate", "pinnacle", "enterprise"],
      user_role: [
        "end_user",
        "professional",
        "facility_admin",
        "placement_agent",
      ],
    },
  },
} as const
