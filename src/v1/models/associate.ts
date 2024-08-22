import { Tenant } from './tenant';
import { TenantBoard } from './tenantBoard';
import { ClassMaster } from './master_class';
Tenant.hasMany(TenantBoard, { foreignKey: 'tenant_id' });
TenantBoard.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(ClassMaster, { foreignKey: 'tenant_id' });
ClassMaster.belongsTo(Tenant, { foreignKey: 'tenant_id' });
