import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

type ActivityStatus = 'active' | 'completed' | 'cancelled';

interface ActivityAttributes {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  maxPeople: number;
  currentPeople: number;
  scheduledTimes: string[];
  campusLocation?: string;
  status: ActivityStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id' | 'currentPeople' | 'status'> {}

class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
  public id!: string;
  public userId!: string;
  public userName!: string;
  public title!: string;
  public description!: string;
  public maxPeople!: number;
  public currentPeople!: number;
  public scheduledTimes!: string[];
  public campusLocation?: string;
  public status!: ActivityStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Activity.init(
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
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    maxPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2,
      },
    },
    currentPeople: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    scheduledTimes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    campusLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'activities',
    timestamps: true,
  }
);

// Define associations
Activity.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });

export default Activity;
