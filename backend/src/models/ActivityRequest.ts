import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Activity from './Activity';

type RequestStatus = 'pending' | 'approved' | 'declined';

interface ActivityRequestAttributes {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userBio: string;
  userSkills: string[];
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActivityRequestCreationAttributes extends Optional<ActivityRequestAttributes, 'id' | 'status'> {}

class ActivityRequest extends Model<ActivityRequestAttributes, ActivityRequestCreationAttributes> implements ActivityRequestAttributes {
  public id!: string;
  public activityId!: string;
  public userId!: string;
  public userName!: string;
  public userBio!: string;
  public userSkills!: string[];
  public status!: RequestStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ActivityRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    activityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'activities',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userBio: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    userSkills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'activity_requests',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['activityId', 'userId'],
      },
    ],
  }
);

// Define associations
ActivityRequest.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
ActivityRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Activity.hasMany(ActivityRequest, { foreignKey: 'activityId', as: 'requests' });
User.hasMany(ActivityRequest, { foreignKey: 'userId', as: 'joinRequests' });

export default ActivityRequest;
