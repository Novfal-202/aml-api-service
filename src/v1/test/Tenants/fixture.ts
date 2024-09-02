export const insert_tenant_request = {
  tenantCreate: {
    name: 'mumbai',
    type: 'Government',
    created_by: 0,
    board_id: [1, 2, 3],
  },
  invalidTenantRequest: {
    type: 'Government',
  },
  invalidTenantSchema: {
    name: 123,
    type: 'Government',
    is_active: true,
    status: 'draft',
    created_by: 'admin',
  },
};

export const updateTenatTenantBoard = {
  validTenantUpdateRequest: {
    tenant: {
      updated_by: 1,
      type: ' update test type tenant',
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
      type: 'Updated tenant',
    },
  },
  tenantBoardNotExistRequest: {
    tenant_board_update: {
      updated_by: 1,
      name: 'Updated Board',
    },
  },
};

export const tenantSearch = {
  validTenantSearchrequest: {
    key: 'tenant',
    filters: {
      type: 'government',
      offset: 0,
      limit: 5,
    },
  },

  validTenantBoardSearchRequest: {
    key: 'tenant_board',
    filters: {
      name: 'new baord',
      is_active: true,
      offset: 0,
      limit: 5,
    },
  },

  invalidSchemaSearchRequest: {
    key: 'tenant_bo',
    filters: {
      name: 'new baord',
      is_active: true,
      offset: 0,
      limit: 5,
    },
  },
  invalidTenantBoardSearchRequest: {
    key: 'tenant_board',
    filters: {
      names: 'new baord',
      is_active: true,
      offset: 0,
      limit: 5,
    },
  },
};
