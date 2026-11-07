type LinkableRow = {
  id: string; slug: string; title: string; organization: string; date_label: string; description: string | null; link_url: string | null; image_url: string | null; published: boolean; sort_order: number; created_at: string; updated_at: string;
};
type LinkableInsert = Partial<Omit<LinkableRow, "id" | "created_at" | "updated_at">>;

export type Database = {
  public: {
    Tables: {
      portfolio_profile: {
        Row: { id: string; handle: string; full_name: string; role: string; headline: string; bio: string; about_text: string; skills: string[]; tools: string[]; location: string; email: string; avatar_url: string | null; linkedin_url: string | null; github_url: string | null; resume_url: string | null; created_at: string; updated_at: string };
        Insert: Partial<{ handle: string; full_name: string; role: string; headline: string; bio: string; about_text: string; skills: string[]; tools: string[]; location: string; email: string; avatar_url: string | null; linkedin_url: string | null; github_url: string | null; resume_url: string | null }>;
        Update: Partial<{ full_name: string; role: string; headline: string; bio: string; about_text: string; skills: string[]; tools: string[]; location: string; email: string; avatar_url: string | null; linkedin_url: string | null; github_url: string | null; resume_url: string | null }>;
        Relationships: [];
      };
      projects: {
        Row: { id: string; slug: string; title: string; subtitle: string; description: string; tags: string[]; visual_type: "home" | "space"; image_url: string | null; project_url: string | null; featured: boolean; published: boolean; sort_order: number; created_at: string; updated_at: string };
        Insert: Partial<{ slug: string; title: string; subtitle: string; description: string; tags: string[]; visual_type: "home" | "space"; image_url: string | null; project_url: string | null; featured: boolean; published: boolean; sort_order: number }>;
        Update: Partial<{ title: string; subtitle: string; description: string; tags: string[]; visual_type: "home" | "space"; image_url: string | null; project_url: string | null; featured: boolean; published: boolean; sort_order: number }>;
        Relationships: [];
      };
      education: { Row: LinkableRow; Insert: LinkableInsert; Update: LinkableInsert; Relationships: [] };
      experience: { Row: LinkableRow; Insert: LinkableInsert; Update: LinkableInsert; Relationships: [] };
      certificates: { Row: LinkableRow; Insert: LinkableInsert; Update: LinkableInsert; Relationships: [] };
      awards: { Row: LinkableRow; Insert: LinkableInsert; Update: LinkableInsert; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      submit_contact_message: { Args: { p_name: string; p_email: string; p_message: string }; Returns: string };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
