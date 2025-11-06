import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConnectionRequestAttributes {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConnectionRequestCreationAttributes 
  extends Optional<ConnectionRequestAttributes, 'id' | 'message'> {}

class ConnectionRequest 
  extends Model<ConnectionRequestAttributes, ConnectionRequestCreationAttributes> 
  implements ConnectionRequestAttributes {
  public id!: string;
  public fromUserId!: string;
  public toUserId!: string;
  public message?: string;
  public status!: 'pending' | 'accepted' | 'declined';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConnectionRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fromUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    toUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined'),
      defaultValue: 'pending',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'connection_requests',
    timestamps: true,
  }
);

export default ConnectionRequest;

