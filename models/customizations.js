import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  category: String,

  icon: String,

  name: String,

  position: Number,

  title: String,

  subtitle: String,

  description: String,

  multiSelect: Boolean,

  options: [
    {
      name: String,
      isStandard: Boolean,
      chooseable: Boolean,
      upgradeText: String,
      commonChoiceText: Boolean,
      subtitle: String,
      choices: [
        {
          image: String,
          title: String,
          subtitles: [{ type: String }],
          isStandard: Boolean,
        },
      ],
    },
  ],

  costNote: String,

  costNote2: String,

  costNotePlacement: String,

  note: String,

  upgradeText: String,

  value: [
    {
      title: String,
      labels: [
        {
          value: String,
          options: String,
        },
      ],
    },
  ],

  bhk: String,

  property: String,

  tower: [{ type: String }],

  attachments: [{ fileName: String, fileUrl: String }],
});

const Customizations = mongoose.model("customizations", customizationSchema);

export default Customizations;
