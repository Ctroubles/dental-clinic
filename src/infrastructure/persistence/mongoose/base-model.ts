import mongoose, {
  type Document,
  type Model,
  Schema,
  type Types,
} from "mongoose"

interface AuditFields {
  createdBy: Types.ObjectId
  updatedBy?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface BaseDoc extends Document, AuditFields {
  createdAt: Date
  updatedAt: Date
}

const baseOptions: mongoose.SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }, // this guy is generating `id` field string based on _id automatically
  toObject: {
    virtuals: true,
    // transform: (doc, ret: AnyObject) => {
    //   // ret!.id = ret!._id.toString()
    //   ret.createdBy = ret.createdBy.toString()
    //   delete ret._id
    //   delete ret.__v
    // },
  },
}

function addAuditHooks(schema: Schema) {
  schema.pre("findOneAndUpdate", function (next) {
    // const _userId = this.getOptions()._userId;
    // if (_userId) this.set({ updatedBy: _userId });

    this.setOptions({
      runValidators: true,
    })

    next()
  })
}

export function createModel<TSchema extends Schema = Schema>(
  name: string,
  schema: TSchema
): Model<TSchema> {
  addAuditHooks(schema)
  return mongoose.models[name] ?? mongoose.model(name, schema)
}

export function createModelWithAudit<TDoc extends Document = Document>(
  name: string,
  schemaDefinition: Record<string, mongoose.SchemaDefinition<unknown>>
): Model<TDoc & BaseDoc> {
  const schema = new Schema(
    {
      ...schemaDefinition,
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
    baseOptions
  )

  addAuditHooks(schema)

  const model =
    mongoose.models[name] ??
    (mongoose.model(name, schema) as unknown as Model<TDoc & BaseDoc>)

  return model
}
