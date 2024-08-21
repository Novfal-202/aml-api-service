export const updateTenatTenantBoard = {
  validTenantUpdateRequest: {
    id: 1,
    updated_by: 1,
    params: 'tenant',
    tenant_name: 'Updated Tenant',
  },

  validTenantBoardUpdateRequest: {
    type: 'update',
    id: 1,
    tenant_id: 1,
    updated_by: 1,
    params: 'tenantBoard',
    name: 'Updated Board',
  },
  validTenantBoardInsertRequest: {
    type: 'insert',
    tenant_id: 1,
    created_by: 1,
    params: 'tenantBoard',
    name: 'Updated Board',
  },

  invalidTenantUpdateRequest: {
    tenant_name: 'Invalid Tenant',
  },
  invalidTenantBoardUpdateRequest: {
    name: 'Invalid Tenant',
    id: 1,
  },
  invalidTenantBoardInsertRequest: {
    name: 'Invalid Tenant',
    id: 1,
    type: 'insert',
  },
  tenantNotExistsRequest: {
    id: 20,
    updated_by: 1,
    params: 'tenant',
    tenant_name: 'Test Tenant',
  },
  tenantBoardNotExistRequest: {
    type: 'update',
    id: 30,
    tenant_id: 20,
    updated_by: 1,
    params: 'tenantBoard',
    name: 'Updated Board',
  },
};

export const InsertTenantTenantBoard = {
  tenantCreate: {
    tenant_name: 'mumbai',
    tenant_type: 'Government',
    created_by: 0,
    tenant_board: [{ name: 'State board' }, { name: 'CBSE' }],
  },
  invalidTenantRequest: {
    tenant_type: 'Government',
  },
  invalidTenantSchema: {
    tenant_name: 123,
    tenant_type: 'Government',
    is_active: true,
    status: 'draft',
    created_by: 'admin',
  },
};
