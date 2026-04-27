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

const addressSchema = new mongoose.Schema<IAddress>(
  {
    houseNo: String,
    street: String,
    barangay: String,
    municipality: String,
    province: String,
    zipCode: String,
  },
  { _id: false }
);

const blotterSchema = new mongoose.Schema<IBlotterDocument>({
  blotterNumber: { type: String, unique: true },

  barangay: { type: mongoose.Schema.Types.ObjectId, ref: 'Barangay', required: true },
  municipality: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required: true },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  incident: {
    type: {
      type: String,
      enum: [
        'Physical Injury', 'Theft', 'Robbery', 'Estafa / Fraud',
        'Threat / Intimidation', 'Unjust Vexation', 'Trespassing',
        'Oral Defamation / Slander', 'Domestic Violence',
        'Drug-Related Incident', 'Noise Disturbance',
        'Property Damage', 'Missing Person', 'Other'
      ],
      required: true
    },
    otherType: String,
    dateOccurred: { type: Date, required: true },
    timeOccurred: String,
    placeOccurred: { type: String, required: true },
    narrative: { type: String, required: true },
    motive: String,
    weaponOrObjectUsed: String,
    isReferred: { type: Boolean, default: false },
    referredTo: String,
    referredDate: Date,
  },

  complainant: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: String,
    suffix: String,
    alias: String,
    sex: { type: String, enum: ['Male', 'Female', 'Other'] },
    birthDate: Date,
    age: Number,
    civilStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Separated', 'Live-in'] },
    nationality: { type: String, default: 'Filipino' },
    religion: String,
    occupation: String,
    contactNumber: String,
    address: addressSchema,
    idType: String,
    idNumber: String,
  },

  respondents: [{
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: String,
    suffix: String,
    alias: String,
    sex: { type: String, enum: ['Male', 'Female', 'Other', 'Unknown'] },
    birthDate: Date,
    age: Number,
    civilStatus: String,
    nationality: { type: String, default: 'Filipino' },
    occupation: String,
    contactNumber: String,
    address: addressSchema,
    relationshipToComplainant: String,
    isKnown: { type: Boolean, default: true },
  }],

  witnesses: [{
    lastName: String,
    firstName: String,
    middleName: String,
    contactNumber: String,
    address: String,
    statement: String,
  }],

  reliefRequested: String,

  barangayAction: {
    actionTaken: String,
    settledAmicably: { type: Boolean, default: false },
    settlementDate: Date,
    settlementDetails: String,
    endorsedToPNP: { type: Boolean, default: false },
    endorsementDate: Date,
    endorsementReason: String,
  },

  status: {
    type: String,
    enum: ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'],
    default: 'recorded'
  },

  recordedBy: {
    name: { type: String, required: true },
    position: String,
    signature: String,
  },

  dateRecorded: { type: Date, default: Date.now },
  lastUpdated: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<IBlotterDocument>('Blotter', blotterSchema);
