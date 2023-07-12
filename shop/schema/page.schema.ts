import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    data: {},
    description: {},
    excerpt: {},
    views: [],
    slug: String,
    title: {},
    elements: {},
    access: { type: String, default: "public" },
    kind: { type: String, default: "page" },
    classes: { type: String, default: "" },
    backgroundColor: String,
    padding: String,
    margin: String,
    path: String,
    maxWidth: { type: String, default: "100%" },
    status: { type: String, default: "processing" },
    photos: [],
    thumbnail: String,
  },
  { timestamps: true }
);

schema.pre("save", function (next) {
  this.slug = this.slug?.replace(/\s+/g, "-").toLowerCase();
  next();
});

schema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (Array.isArray(update)) {
    // aggregate
    const addFields = update.find((p) => p["$addFields"]);
    if (addFields && addFields["slug"]) {
      addFields["slug"] = addFields["slug"].replace(/\s+/g, "-").toLowerCase();
    }
  } else {
    // update query
    if (update.$set?.slug)
      this.setUpdate({
        $set: { slug: update.$set.slug.replace(/\s+/g, "-").toLowerCase() },
      });
  }
  next();
});

export default schema;
