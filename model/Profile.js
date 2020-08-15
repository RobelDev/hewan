const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  typemember: {
    type: String,
    default: "basic",
  },

  name: {
    type: String,
    required: true,
  },

  birthday: {
    type: String,
  },

  gender: {
    type: String,
    required: true,
  },

  lookingfor: {
    type: String,
    required: true,
  },
  college: {
    type: String,
  },

  passion: {
    type: String,
  },

  languages: {
    type: String,
  },

  aboutme: {
    type: String,
  },

  job: {
    type: String,
  },
  religion: {
    type: String,
  },

  company: {
    type: String,
  },

  insta: {
    type: String,
  },

  music: {
    type: String,
  },

  livesin: {
    type: String,
  },

  currentlocation: {
    type: String,
  },

  mycoordinates: {
    type: Object,
  },

  lookinglocation: {
    type: String,
  },

  lookingcoordinates: {
    type: Object,
  },

  boost: {
    type: Boolean,
    default: false,
  },

  likes: [
    {
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    },
  ],
  myliked: [
    {
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    },
  ],
  mysuperliked: [
    {
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    },
  ],
  mydisliked: [
    {
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    },
  ],
  matches: [
    {
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    },
  ],
  images: [
    {
      key: {
        type: String,
      },
      bucket: {
        type: String,
      },
      locationUrl: {
        type: String,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
