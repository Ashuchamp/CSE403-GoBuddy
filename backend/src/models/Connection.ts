import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConnectionAttributes {
  id: string;
  userId: string;
  connectedUserId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConnectionCreationAttributes 
  extends Optional<ConnectionAttributes, 'id'> {}

class Connection 
  extends Model<ConnectionAttributes, ConnectionCreationAttributes> 
  implements ConnectionAttributes {
  public id!: string;
  public userId!: string;
  public connectedUserId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Connection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    connectedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'connections',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'connectedUserId'],
      },
    ],
  }
);

export default Connection;

