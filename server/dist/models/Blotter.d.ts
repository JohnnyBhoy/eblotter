import mongoose, { type Document } from 'mongoose';
interface IAddress {
    houseNo?: string;
    street?: string;
    barangay?: string;
    municipality?: string;
    province?: string;
    zipCode?: string;
}
interface IPerson {
    lastName: string;
    firstName: string;
    middleName?: string;
    suffix?: string;
    alias?: string;
    sex?: 'Male' | 'Female' | 'Other' | 'Unknown';
    birthDate?: Date;
    age?: number;
    civilStatus?: string;
    nationality?: string;
    religion?: string;
    occupation?: string;
    contactNumber?: string;
    address?: IAddress;
    idType?: string;
    idNumber?: string;
    relationshipToComplainant?: string;
    isKnown?: boolean;
}
interface IWitness {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    contactNumber?: string;
    address?: string;
    statement?: string;
}
export interface IBlotterDocument extends Document {
    blotterNumber?: string;
    barangay: mongoose.Types.ObjectId | Record<string, unknown>;
    municipality: mongoose.Types.ObjectId | Record<string, unknown>;
    province: mongoose.Types.ObjectId | Record<string, unknown>;
    createdBy: mongoose.Types.ObjectId | Record<string, unknown>;
    incident: {
        type: string;
        otherType?: string;
        dateOccurred: Date;
        timeOccurred?: string;
        placeOccurred: string;
        narrative: string;
        motive?: string;
        weaponOrObjectUsed?: string;
        isReferred?: boolean;
        referredTo?: string;
        referredDate?: Date;
    };
    complainant: IPerson;
    respondents: IPerson[];
    witnesses: IWitness[];
    reliefRequested?: string;
    barangayAction?: {
        actionTaken?: string;
        settledAmicably?: boolean;
        settlementDate?: Date;
        settlementDetails?: string;
        endorsedToPNP?: boolean;
        endorsementDate?: Date;
        endorsementReason?: string;
    };
    status: 'draft' | 'recorded' | 'under_mediation' | 'settled' | 'referred_to_pnp' | 'closed';
    recordedBy: {
        name: string;
        position?: string;
        signature?: string;
    };
    dateRecorded: Date;
    lastUpdated?: Date;
    updatedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IBlotterDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBlotterDocument, {}, {}> & IBlotterDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
