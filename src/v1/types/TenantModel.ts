export interface UpdateTenant {
  id?: number;
  tenant_name?: string;
  tenant_type?: string;
  status?: string;
  is_active?: boolean;
  created_by?: number;
  created_at?: number;
  updated_by?: number;
  updated_at?: number;
}
