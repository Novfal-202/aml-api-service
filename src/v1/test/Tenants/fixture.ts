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

export const updateTenatTenantBoard = {
  validTenantUpdateRequest: {
    tenant: {
      updated_by: 1,
      tenant_type: ' update test type tenant',
    },
  },

  validTenantBoardUpdateRequest: {
    tenant_board_update: {
      id: 1,
      updated_by: 1,
      name: 'Updated Board',
    },
  },

  validTenantBoardMultiUpdateRequest: {
    tenant_board_update: {
      updated_by: 1,
      name: 'Updated Board',
    },
  },

  validTenantBoardInsertRequest: {
    tenant_board_insert: [
      {
        created_by: 1,
        name: 'new Board',
      },
    ],
  },

  invalidTenantUpdateRequest: {
    tenant: {
      created_by: 1,
      name: 'tenant',
    },
  },
  invalidTenantBoardUpdateRequest: {
    tenant_board_update: {
      created_by: 1,
      name: 'Updated Board',
    },
  },
  invalidTenantBoardInsertRequest: {
    tenant_board_insert: [
      {
        updated_by: 1,
        name: 'new Board',
      },
    ],
  },
  tenantNotExistsRequest: {
    tenant: {
      updated_by: 1,
      tenant_type: 'Updated tenant',
    },
  },
  tenantBoardNotExistRequest: {
    tenant_board_update: {
      updated_by: 1,
      name: 'Updated Board',
    },
  },
};
