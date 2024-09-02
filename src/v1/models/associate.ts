import { Tenant } from './tenant';
import { MasterBoard } from './masterBoard';
import { MasterClass } from './masterClass';

Tenant.hasMany(MasterBoard, { foreignKey: 'board_id' });
Tenant.hasMany(MasterClass, { foreignKey: 'tenant_id' });

MasterClass.belongsTo(Tenant, { foreignKey: 'tenant_id' });
