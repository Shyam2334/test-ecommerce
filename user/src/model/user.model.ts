import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    admin: boolean
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    }
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export { IUser, UserModel };