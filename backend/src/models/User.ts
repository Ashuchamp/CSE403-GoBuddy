import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: string;
  email: string;
  name: string;
  bio: string;
  skills: string[];
  preferredTimes: string[];
  activityTags: string[];
  phone?: string;
  instagram?: string;
  campusLocation?: string;
  googleId?: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'bio' | 'skills' | 'preferredTimes' | 'activityTags'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public name!: string;
  public bio!: string;
  public skills!: string[];
  public preferredTimes!: string[];
  public activityTags!: string[];
  public phone?: string;
  public instagram?: string;
  public campusLocation?: string;
  public googleId?: string;
  public profilePicture?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    preferredTimes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    activityTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    campusLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
